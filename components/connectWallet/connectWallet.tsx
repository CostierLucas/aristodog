import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import styles from "./connectWallet.module.scss";
import Modal from "../modal/modal";

const ConnectWallet = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const context = useWeb3React<any>();
  const { connector, account } = context;

  return (
    <>
      {!account ? (
        <div>
          <button
            className="h-[50px] w-full lg:w-auto px-5 md:py-0 rounded-xl text-white text-lg font-bold bg-orange-500 hover:bg-orange-400 transition duration-300"
            onClick={() => setOpenModal(!openModal)}
          >
            Connect wallet
          </button>
          {openModal && <Modal closeModal={setOpenModal} />}
        </div>
      ) : (
        <p className="text-white font-bold bg-orange-500 px-5 rounded-xl ">
          {`${account.substring(0, 6)}...${account.substring(
            account.length - 4
          )}`}
        </p>
      )}
    </>
  );
};

export default ConnectWallet;
