import { AiFillCloseCircle } from "react-icons/ai";
import styles from "./modalNft.module.scss";

const ModalNft = ({
  closeModal,
  tokensAllowed,
  tokenSelected,
}: {
  closeModal: any;
  tokensAllowed: string[] | undefined;
  tokenSelected: any;
}) => {
  const chooseToken = (token: string) => {
    tokenSelected(parseInt(token));
    closeModal();
  };
  return (
    <div className={styles.backgroundModal}>
      <div className={`${styles.modal_nft} bg-orange-400`}>
        <div className={styles.btnClose}>
          <button onClick={() => closeModal(false)}>
            <AiFillCloseCircle color="#5E2427" size={25} />
          </button>
        </div>
        <div>
          <h1 className="text-2xl text-center text-white mb-10">NFTs</h1>
          <div className="lg:grid-cols-3 xl:grid-cols-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 px-8">
            {tokensAllowed?.map((token, index) => (
              <div
                className="card rounded-2xl overflow-hidden group md:hover:scale-[1.03] transition"
                key={index}
                onClick={() => chooseToken(token)}
              >
                <p>{parseInt(token)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNft;
