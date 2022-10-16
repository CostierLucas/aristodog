import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  contractAddressNft,
  contractAddressRaffle,
  targetChainId,
} from "../../WalletHelpers/contractVariables";
import ContractAbiRaffle from "../../WalletHelpers/contractAbiRaffle.json";
import { ethers } from "ethers";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ContractAbiNft from "../../WalletHelpers/contractAbiNft.json";

const SectionRaffle: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer>();
  const [isContract, setIsContract] = useState<ethers.Contract>();
  const [raffleItem, setRaffleItem] = useState<any[]>([]);
  const [numberOfTickets, setNumberOfTickets] = useState<number>(1);
  const [isParticipants, setIsParticipants] = useState("");
  const [isSelected, setIsSelected] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<number>(0);
  const context = useWeb3React<any>();
  const { account, provider, chainId } = context;
  const router = useRouter();
  const { raffle } = router.query;

  useEffect(() => {
    if (!!provider && chainId == targetChainId && !!account) {
      getDatas();
    }
  }, [provider, chainId]);

  const getDatas = async () => {
    const getSigner = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddressRaffle,
      ContractAbiRaffle,
      getSigner
    );

    try {
      const raffleItem = await contract.getRaffleInfo(raffle);

      const nftContract = new ethers.Contract(
        raffleItem[3],
        ContractAbiNft,
        getSigner
      );
      const getTokenUri = await nftContract.tokenURI(parseInt(raffleItem[0]));

      const fetch = await fetchImage(
        `https://ipfs.io/ipfs/${getTokenUri.slice(7)}`
      );

      const count = raffleItem[10].reduce(
        (accumulator: { [x: string]: any }, value: string | number) => {
          return { ...accumulator, [value]: (accumulator[value] || 0) + 1 };
        },
        {}
      );

      const lol = [...raffleItem, fetch];

      setIsParticipants(count);
      setRaffleItem(lol);
      setStartDate(Date.now());
    } catch (e) {
      console.log(e);
    }
    setSigner(getSigner);
    setIsContract(contract);
  };

  const enterRaffle = async () => {
    setIsLoading(true);
    let total = raffleItem[5] * numberOfTickets;
    try {
      const tx = await isContract?.enterRaffle(raffle, numberOfTickets, {
        value: total.toString(),
      });
      await tx.wait();
      setIsLoading(false);
      toast.success("You have successfully entered the raffle!");
    } catch (e) {
      setIsLoading(false);
      toast.error("Something went wrong!");
    }
    setIsLoading(false);
    getDatas();
  };

  const addNumberOfTickets = () => {
    setNumberOfTickets(numberOfTickets + 1);
  };

  const removeNumberOfTickets = () => {
    if (numberOfTickets > 1) {
      setNumberOfTickets(numberOfTickets - 1);
    }
  };

  const fetchImage = async (getTokenUri: string) => {
    try {
      const imageNft = await fetch(getTokenUri);
      const imageNftJson = await imageNft.json();
      let urlImage = `https://ipfs.io/ipfs/${imageNftJson.image.slice(7)}`;
      return urlImage;
    } catch (e) {
      console.log(e);
    }
  };

  if (!account) {
    return (
      <div className="fixed h-full w-full flex items-center justify-center ">
        <div className="z-10">
          <div className="text-white font-bold text-2xl">
            Connect your wallet first
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container-fluid pl-14 pr-14">
        <div className="w-full flex flex-col lg:flex-row mt-7">
          <div className="w-full lg:w-1/3 md:mr-8 px-8 pt-5 md:pt-0 md:px-0 self-start">
            <div>
              <img src={raffleItem[12]} className="w-100" />
            </div>
            <div className="flex justify-around mt-5">
              <div>
                <button
                  className="text-white text-2xl"
                  onClick={removeNumberOfTickets}
                >
                  -
                </button>
              </div>
              <div>
                <span className="text-white text-2xl">{numberOfTickets}</span>
              </div>
              <div>
                <button
                  className="text-white text-2xl"
                  onClick={addNumberOfTickets}
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-center mt-5 w-full">
              <button
                className="w-full bg-orange-400 rounded-lg text-white py-3 text-xl font-bold hover:bg-orange-500 transition duration-300"
                onClick={enterRaffle}
              >
                {isLoading ? (
                  <BeatLoader color={"#fff"} size={10} />
                ) : (
                  "Enter Raffle"
                )}
              </button>
            </div>
          </div>
          <div className="lg:w-2/3 bg-white dark:bg-offbase md:rounded-2xl p-8 mt-5 md:mt-0 transition">
            <div className="flex gap-5">
              <div className="text-xl font-bold">
                <button
                  onClick={() => setIsSelected(0)}
                  className={`${
                    isSelected == 0 ? "text-orange-400" : "text-black-400"
                  }`}
                >
                  Details
                </button>
              </div>
              <div className="text-xl font-bold">
                <button
                  onClick={() => setIsSelected(1)}
                  className={`${
                    isSelected == 1 ? "text-orange-400" : "text-black-400"
                  }`}
                >
                  Participants
                </button>
              </div>
            </div>
            <hr className="mt-3" />
            {isSelected == 0 && (
              <div className="mt-5">
                <div className="flex justify-between">
                  <div className="text-xl font-bold">
                    <span className="text-sm"> Raffle ended on </span>
                    <br />
                    <span className="text-lg">
                      {new Date(raffleItem[2] * 1000).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xl font-bold">
                    <span className="text-sm"> Raffle start date </span>
                    <br />
                    <span className="text-lg">
                      {new Date(startDate * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-5">
                  <div className="text-xl font-bold">
                    <span className="text-sm">Raffle price</span>
                    <br />
                    <span className="text-2xl">
                      {raffleItem[5] / 10 ** 18} CRO
                    </span>
                  </div>
                  <div className="text-xl font-bold">
                    <span className="text-sm">Tickets sold</span>
                    <br />
                    <span className="text-2xl">
                      {parseInt(raffleItem[7])} / {parseInt(raffleItem[6])}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {isSelected == 1 && (
              <div className="mt-5">
                <ul className="overflow-scroll">
                  {Object.keys(isParticipants).map((key) => {
                    return (
                      <li key={key} className="flex justify-between">
                        <div className="text-xl font-bold">
                          <span className="text-sm"> {key} </span>
                        </div>
                        <div className="text-xl font-bold">
                          <span className="text-sm">
                            {isParticipants[key as unknown as number]}{" "}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionRaffle;
