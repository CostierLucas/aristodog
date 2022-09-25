import { useState, useEffect } from "react";
import styles from "../connectWallet/connectWallet.module.scss";
import MetaMaskCard from "../Web3/connectors/MetaMaskCard";
import CoinbaseWalletCard from "../Web3/connectors/CoinbaseWalletCard";
import WalletConnectCard from "../Web3/connectors/WalletConnectCard";
import { metamaskURL } from "../../WalletHelpers/contractVariables";
import { AiFillCloseCircle } from "react-icons/ai";

const Modal = ({ closeModal }: { closeModal: any }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsMobile(true);
    }
  }, []);

  return (
    <div className={`${styles.modal} bg-orange-400`}>
      <div className={styles.btnClose}>
        <button onClick={() => closeModal(false)}>
          <AiFillCloseCircle color="#5E2427" size={25} />
        </button>
      </div>
      <div className={styles.walletContainerSelect}>
        <div
          className={styles.metamask}
          onClick={() => {
            if (isMobile && !window.ethereum) {
              return (window.location.href = metamaskURL);
            }
          }}
        >
          <MetaMaskCard />
        </div>
        <div className={styles.walletConnect}>
          <CoinbaseWalletCard />
        </div>
        <div className={styles.walletLink}>
          <WalletConnectCard />
        </div>
      </div>
    </div>
  );
};

export default Modal;
