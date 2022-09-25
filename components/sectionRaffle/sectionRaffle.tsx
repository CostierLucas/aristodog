import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  contractAddressRaffle,
  targetChainId,
} from "../../WalletHelpers/contractVariables";
import ContractAbiRaffle from "../../WalletHelpers/contractAbiRaffle.json";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const SectionRaffle: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer>();
  const [isContract, setIsContract] = useState<ethers.Contract>();
  const [raffleItem, setRaffleItem] = useState([]);
  const [numberOfTickets, setNumberOfTickets] = useState<number>(1);
  const [isParticipants, setIsParticipants] = useState<boolean>(false);
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
    let participantsArray = [];

    try {
      const raffleItem = await contract.raffle(raffle);
      console.log(raffleItem[8].toString());

      for (let i = 0; i < raffleItem[9].length; i++) {
        participantsArray.push(raffleItem[9][i]);
      }

      setRaffleItem(raffleItem);
    } catch (e) {
      console.log(e);
    }
    setSigner(getSigner);
    setIsContract(contract);
  };

  const enterRaffle = async () => {
    let total = raffleItem[4] * numberOfTickets;
    try {
      const tx = await isContract?.enterRaffle(raffle, numberOfTickets, {
        value: total.toString(),
      });
      const receipt = await tx.wait();
    } catch (e) {
      console.log(e);
    }
  };

  const addNumberOfTickets = () => {
    setNumberOfTickets(numberOfTickets + 1);
  };

  const removeNumberOfTickets = () => {
    if (numberOfTickets > 1) {
      setNumberOfTickets(numberOfTickets - 1);
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
      <div className="container-fluid pl-5 pr-5">
        <div className="w-full flex flex-col lg:flex-row mt-7">
          <div className="w-full lg:w-1/3 md:mr-8 px-8 pt-5 md:pt-0 md:px-0 self-start">
            <div>
              <img src="/bayc.png" className="w-32" />
            </div>
            <div className="flex justify-around mt-5">
              <div>
                <button className="text-white" onClick={removeNumberOfTickets}>
                  -
                </button>
              </div>
              <div>
                <span className="text-white text-2xl">{numberOfTickets}</span>
              </div>
              <div>
                <button className="text-white" onClick={addNumberOfTickets}>
                  +
                </button>
              </div>
            </div>
            <div className="text-center mt-5 w-full">
              <button
                className="w-full bg-orange-400 rounded-lg text-white py-3 text-xl font-bold hover:bg-orange-500 transition duration-300"
                onClick={enterRaffle}
              >
                Enter Raffle
              </button>
            </div>
          </div>
          <div className="lg:w-2/3 bg-white dark:bg-offbase md:rounded-2xl p-8 mt-5 md:mt-0 transition"></div>
        </div>
      </div>
    </div>
  );
};

export default SectionRaffle;
