import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import {
  targetChainId,
  contractAddressRaffle,
  contractAddressNft,
  contractCroAddress,
} from "../../WalletHelpers/contractVariables";
import ContractAbiRaffle from "../../WalletHelpers/contractAbiRaffle.json";
import ContractAbiNft from "../../WalletHelpers/contractAbiNft.json";
import { ethers } from "ethers";
import ModalNft from "../modalNft/modalNft";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/router";

interface IRaffle {
  price: string;
  maxTickets: string;
  IERC20: string;
  collectionAdress: string;
  timestamp: number;
}

const FormRaffle: React.FC = () => {
  const context = useWeb3React<any>();
  const router = useRouter();
  const { account, provider, chainId } = context;
  const [signer, setSigner] = useState<ethers.Signer>();
  const [isContractRaffle, setIsContractRaffle] = useState<ethers.Contract>();
  const [isTokenAllowed, setIsTokenAllowed] = useState<string[] | undefined>();
  const [arrTokenAllowed, setArrTokenAllowed] = useState<any[]>();
  const [tokenSelected, setTokenSelected] = useState<string>("");
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [raffle, setRaffle] = useState<IRaffle>({
    price: "",
    maxTickets: "",
    IERC20: contractCroAddress,
    collectionAdress: "",
    timestamp: 0,
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number>(0);

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

    const nftContract = new ethers.Contract(
      contractAddressNft,
      ContractAbiNft,
      getSigner
    );

    const collections = await contract.projectTokensOfWallet(
      contractAddressNft,
      account
    );

    const arrTokenAllowed = [];

    for (let i = 0; i < collections.length; i++) {
      const isApproved = await nftContract.getApproved(
        parseInt(collections[i])
      );

      if (isApproved == "0x0000000000000000000000000000000000000000") {
        arrTokenAllowed.push([false, parseInt(collections[i])]);
      } else {
        arrTokenAllowed.push([true, parseInt(collections[i])]);
      }
    }

    const currentId = await contract.raffleID();

    console.log(arrTokenAllowed);

    setCurrentId(parseInt(currentId) + 1);
    setSigner(getSigner);
    setIsContractRaffle(contract);
    setIsTokenAllowed(collections);
    setArrTokenAllowed(arrTokenAllowed);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tokenSelected == "") {
        toast.error("choose a nft");
        return;
      }

      const tx = await isContractRaffle?.createRaffle(
        ethers.utils.parseEther(raffle.price).toString(),
        raffle.maxTickets,
        tokenSelected,
        raffle.timestamp,
        contractAddressNft,
        {
          value: ethers.utils.parseEther("25"),
        }
      );

      await tx.wait();
      toast.success("Raffle created");
      router.push(`/single/?raffle=${currentId}`);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const approve = async (tokenId: number) => {
    const contract = new ethers.Contract(
      contractAddressNft,
      ContractAbiNft,
      provider.getSigner()
    );

    try {
      const tx = await contract.approve(contractAddressRaffle, tokenId);
      await tx.wait();
      toast.success("Nft approved");
      getDatas();
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
    <div className="container mx-auto">
      <h1 className="text-center text-white font-bold mt-7 text-5xl">
        CREATE NEW RAFFLE
      </h1>
      <form method="post" onSubmit={handleSubmit}>
        <div className="w-full flex flex-col lg:flex-row mt-7">
          <div className="w-full lg:w-1/3 md:mr-8 px-8 pt-5 md:pt-0 md:px-0 self-start">
            <div
              onClick={() => setOpenModal(!openModal)}
              className="flex flex-col p-8 sm:py-16 justify-center items-center h-full rounded-2xl overflow-hidden text-white dark:text-orange-400/70 border-4 border-white dark:border-primary hover:border-primary bg-offbase cursor-pointer group"
            >
              {tokenSelected === "" ? (
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="fill-current w-20 group-hover:text-primary transition"
                  >
                    <path d="M384 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12zm120 16c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-48 0c0-110.5-89.5-200-200-200S56 145.5 56 256s89.5 200 200 200 200-89.5 200-200z"></path>
                  </svg>
                  <p className="font-bold text-xl group-hover:text-primary mt-3">
                    Choose your NFT
                  </p>
                </div>
              ) : (
                <img
                  src="/bayc.png"
                  alt="nft"
                  className="w-40 h-40 object-cover rounded-full"
                />
              )}
            </div>
            {openModal && (
              <ModalNft
                closeModal={setOpenModal}
                tokensAllowed={isTokenAllowed}
                tokenSelected={setTokenSelected}
                arrTokensAllowed={arrTokenAllowed}
                approveToken={approve}
              />
            )}
          </div>
          <div className="lg:w-2/3 bg-white dark:bg-offbase md:rounded-2xl p-8 mt-5 md:mt-0 transition">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/5 mb-3 lg:mb-0 lg:mr-4">
                <strong className="block pl-3 text-sm text-gray-600 dark:text-orange-400/70">
                  Raffle end date
                </strong>
                <div className="relative">
                  <input
                    className="border-2 w-full border-primary focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none  
                                    bg-lightbase dark:bg-transparent p-3 rounded-2xl text-primary font-bold text-xl"
                    type="datetime-local"
                    name="enddate"
                    id="enddate"
                    onChange={(e) => {
                      let raffleTimestamp = Date.parse(e.target.value) / 1000;
                      let currentTimestamp = Math.floor(Date.now() / 1000);
                      let finalTimestamp = raffleTimestamp - currentTimestamp;

                      setRaffle({
                        ...raffle,
                        timestamp: finalTimestamp,
                      });
                    }}
                    required
                  ></input>
                </div>
              </div>
              <div className="lg:w-1/5 mb-3 lg:mb-0 lg:mr-4">
                <strong className="block pl-3 text-sm text-gray-600 dark:text-orange-400/70">
                  Ticket supply
                </strong>
                <div>
                  <input
                    className="border-2 w-full border-primary focus:border-orange-500 dark:focus:border-orange-500  focus:outline-none bg-lightbase dark:bg-transparent p-3 rounded-2xl text-center 
                                        text-primary font-bold text-xl appearance-none"
                    min="0"
                    max="5000"
                    type="number"
                    name="supply"
                    id="supply"
                    required
                    onChange={(e) => {
                      setRaffle({
                        ...raffle,
                        maxTickets: e.target.value,
                      });
                    }}
                  ></input>
                </div>
              </div>
              <div className="lg:w-2/5 mb-3 lg:mb-0 flex">
                <div>
                  <strong className="block pl-3 text-sm text-gray-600 dark:text-orange-400/70">
                    Ticket price
                  </strong>
                  <div className="flex">
                    <input
                      className="border-2 w-full border-primary focus:border-orange-500 dark:focus:border-orange-500  
                                            focus:outline-none bg-lightbase dark:bg-transparent p-3 rounded-tl-2xl rounded-bl-2xl text-primary font-bold text-xl"
                      type="number"
                      name="price"
                      id="price"
                      onChange={(e) => {
                        setRaffle({ ...raffle, price: e.target.value });
                      }}
                      required
                    ></input>
                    <select
                      className="-ml-1 border-2 w-full border-primary focus:border-orange-500 dark:focus:border-orange-500 3 focus:outline-none bg-lightbase 
                                            dark:bg-transparent p-3 rounded-tr-2xl rounded-br-2xl text-primary font-bold text-xl"
                      onChange={(e) => {
                        setRaffle({ ...raffle, IERC20: e.target.value });
                      }}
                    >
                      <option value={contractCroAddress}>CRO</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row mt-4 justify-between items-center">
              <div className="w-full lg:w-auto mt-4 lg:mt-0">
                <button
                  className="h-[60px] w-full lg:w-auto px-8 md:py-0 bg-gradient-to-t from-lime-600 to-lime-400 border border-lime-500  
                                opacity-90 hover:opacity-100 rounded-xl text-white text-xl font-bold transition"
                  type="submit"
                >
                  {isLoading ? <BeatLoader color="#fff" /> : "Create raffle"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormRaffle;
