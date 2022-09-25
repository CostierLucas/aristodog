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
            className={styles.btnConnect}
            onClick={() => setOpenModal(!openModal)}
          >
            Connect wallet
          </button>
          {openModal && <Modal closeModal={setOpenModal} />}
        </div>
      ) : (
        <p>
          {`${account.substring(0, 6)}...${account.substring(
            account.length - 4
          )}`}
        </p>
      )}
    </>
  );
};

export default ConnectWallet;
