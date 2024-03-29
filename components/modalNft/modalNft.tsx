import { AiFillCloseCircle } from "react-icons/ai";
import styles from "./modalNft.module.scss";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { BounceLoader } from "react-spinners";

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

  const chooseToken = (
    token: string,
    urlImage: string,
    contractNft: string
  ) => {
    tokenSelected([parseInt(token), urlImage, contractNft]);
    closeModal();
  };

  const approve = async (token: number, contractNft: string) => {
    setIsApproving(token);
    setIsLoading(true);
    try {
      const approve = await approveToken(token, contractNft);
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
            {tokensAllowed ? (
              tokensAllowed?.map((token, index) => (
                <div
                  className="card bg-white rounded-2xl overflow-hidden group relative"
                  key={index}
                >
                  {arrTokensAllowed[index][4] && (
                    <div className="absolute left-2 top-1 bg-indigo-800 text-white pl-2 pr-2 rounded-2xl">
                      <p>Partners : {parseInt(token)}</p>
                    </div>
                  )}
                  <img src={arrTokensAllowed[index][2]} alt="nft image" />
                  <div className="text-center text-lg font-bold">
                    <p>Token : {parseInt(token)}</p>
                    {arrTokensAllowed[index][0] == false ? (
                      <button
                        className=" rounded bg-orange-400 pe-4 pr-4 pl-4 mb-2 mt-3 text-white"
                        onClick={() =>
                          approve(parseInt(token), arrTokensAllowed[index][3])
                        }
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
                        onClick={() =>
                          chooseToken(
                            token,
                            arrTokensAllowed[index][2],
                            arrTokensAllowed[index][3]
                          )
                        }
                      >
                        Choose
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <BounceLoader color={"#fff"} size={50} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNft;
