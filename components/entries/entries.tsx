import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  contractAddressRaffle,
  targetChainId,
} from "../../WalletHelpers/contractVariables";
import ContractAbiRaffle from "../../WalletHelpers/contractAbiRaffle.json";
import { ethers, utils } from "ethers";
import Link from "next/link";
import { BounceLoader } from "react-spinners";
import ContractAbiNft from "../../WalletHelpers/contractAbiNft.json";
import Countdown from "react-countdown";
import Renderer from "../countdown/countdown";

const Entries: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer>();
  const [isContract, setIsContract] = useState<ethers.Contract>();
  const [raffle, setRaffle] = useState<string[][]>([]);
  const context = useWeb3React<any>();
  const { account, provider, chainId } = context;

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
      const raffleItem = await contract.getUserRafflesRegistered(account);
      const partnersCollections = await contract.getPartnersCollections();
      let raffleArray: any = [];

      for (let i = 0; i < raffleItem.length; i++) {
        let raffle = await contract.getRaffleInfo(raffleItem[i]);
        const nftContract = new ethers.Contract(
          raffle[3],
          ContractAbiNft,
          getSigner
        );
        const getTokenUri = await nftContract.tokenURI(parseInt(raffle[4]));

        let userNumbersOfTickets = await contract.getUserNumberOfTickets(
          account,
          raffle[0]
        );

        const fetch = await fetchImage(
          `https://ipfs.io/ipfs/${getTokenUri.slice(7)}`
        );

        const lol = [
          ...raffle,
          fetch,
          userNumbersOfTickets,
          partnersCollections.includes(raffle[3]),
        ];
        raffleArray.push(lol);
      }

      let raffleArrayFiltered = raffleArray
        .map(JSON.stringify)
        .filter((e: any, i: any, a: string | any[]) => i === a.indexOf(e))
        .map(JSON.parse);

      setRaffle(raffleArrayFiltered);
    } catch (e) {
      console.log(e);
    }

    setSigner(getSigner);
    setIsContract(contract);
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
      <h1 className="text-center text-white font-bold mt-7 text-5xl">
        My Entries
      </h1>
      {raffle.length > 0 ? (
        <>
          <div className="lg:grid-cols-3 xl:grid-cols-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 px-8 mt-10">
            {raffle.map((item: any, index) => {
              return (
                <div key={index} className="lazyload-wrapper ">
                  <div className="card rounded-2xl overflow-hidden group md:hover:scale-[1.03] transition">
                    <div className="relative">
                      <div className=" aspect-w-1 aspect-h-1 cursor-pointer relative">
                        <div className="absolute right-2 top-1 bg-white bg-opacity-50 pl-2 pr-2 rounded-2xl">
                          <p className="text-white">
                            ID : {parseInt(item[0]["hex"])}
                          </p>
                        </div>
                        {item[13] && (
                          <div className="absolute left-2 top-1 bg-indigo-800 text-white pl-2 pr-2 rounded-2xl">
                            <p>Partners</p>
                          </div>
                        )}
                        <img
                          className="h-full object-center object-cover"
                          src={item[12]}
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-white dark:bg-offbase transition-all overflow-hidden rounded-b-2xl">
                      <div className="flex items-center">
                        <a
                          className="line-clamp-1 text-[#665F5F] hover:text-[#DB8511] text-sm mr-1 capitalize"
                          href={`/single/?raffle=${parseInt(item[0]["hex"])}`}
                        ></a>
                      </div>
                      <h2 className="text-left text-[#DB8511] line-clamp-1 text-xl"></h2>
                      <div className="flex justify-between mb-3">
                        <div>
                          <strong className="block text-sm text-[#665F5F] font-bold">
                            Tickets Remaining
                          </strong>
                          <div className="text-left leading-none text-[#DB8511] text-xl">
                            {parseInt(item[7]["hex"])} /
                            {parseInt(item[6]["hex"])}
                          </div>
                        </div>
                        <div>
                          <strong className="block text-sm text-[#665F5F]  font-bold">
                            Price/Ticket
                          </strong>
                          <div className="text-right leading-none text-[#DB8511]  text-xl">
                            {utils.formatEther(item[5])} CRO
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mb-3">
                        <div>
                          <strong className="block text-sm text-[#665F5F] font-bold">
                            Number of tickets
                          </strong>
                          <div className="text-left leading-none text-[#DB8511] text-xl">
                            {parseInt(item[13]["hex"])}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/single/?raffle=${parseInt(item[0]["hex"])}`}
                      >
                        <a className="bg-[#996520] block text-center py-3 mt-2 bg-gradient-to-t opacity-90 hover:opacity-100 text-white text-xl rounded-2xl border dark:to-transparent dark:from-transparent dark:border-2 transition-all">
                          View raffle
                          <div className="text-xs">
                            <Countdown
                              date={new Date(parseInt(item[2]["hex"]) * 1000)}
                              renderer={Renderer}
                            />
                          </div>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="fixed h-full w-full flex items-center justify-center ">
          <div className="z-10">
            <BounceLoader className="mx-auto" color="#ED974F" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Entries;
