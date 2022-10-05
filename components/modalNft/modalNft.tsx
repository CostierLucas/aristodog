import { AiFillCloseCircle } from "react-icons/ai";
import styles from "./modalNft.module.scss";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

const ModalNft = ({
  closeModal,
  tokensAllowed,
  tokenSelected,
  arrTokensAllowed,
  approveToken,
}: {
  closeModal: any;
  tokensAllowed: string[] | undefined;
  tokenSelected: any;
  arrTokensAllowed: any;
  approveToken: any;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<number>(0);

  const chooseToken = (token: string) => {
    tokenSelected(parseInt(token));
    closeModal();
  };

  const approve = async (token: number) => {
    setIsApproving(token);
    setIsLoading(true);
    try {
      const approve = await approveToken(token);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
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
          <div className="lg:grid-cols-3 xl:grid-cols-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 px-8">
            {tokensAllowed?.map((token, index) => (
              <div
                className="card bg-white rounded-2xl overflow-hidden group"
                key={index}
              >
                <img src="/bayc.png" alt="bayc" />
                <div className="text-center text-lg font-bold">
                  <p>Token : {parseInt(token)}</p>
                  {arrTokensAllowed[index][0] == false ? (
                    <button
                      className=" rounded bg-orange-400 pe-4 pr-4 pl-4 mb-2 mt-3 text-white"
                      onClick={() => approve(parseInt(token))}
                    >
                      {isLoading && isApproving == parseInt(token) ? (
                        <BeatLoader color={"#fff"} size={10} />
                      ) : (
                        "Approve"
                      )}
                    </button>
                  ) : (
                    <button
                      className=" rounded bg-orange-400 pe-4 pr-4 pl-4 mb-2 mt-3 text-white"
                      onClick={() => chooseToken(token)}
                    >
                      Choose
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNft;
