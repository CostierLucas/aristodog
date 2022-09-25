import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from "../WalletHelpers/connectors/coinbaseWallet";
import {
  hooks as metaMaskHooks,
  metaMask,
} from "../WalletHelpers/connectors/metaMask";
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../WalletHelpers/connectors/walletConnect";

const connectors: [
  MetaMask | WalletConnect | CoinbaseWallet,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
];
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Web3ReactProvider connectors={connectors}>
        <Head>
          <title>Raffle nft</title>
        </Head>
        <ToastContainer />
        <Component {...pageProps} />
      </Web3ReactProvider>
    </>
  );
}

export default MyApp;
