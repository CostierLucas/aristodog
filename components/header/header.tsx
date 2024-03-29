import { useState } from "react";
import Link from "next/link";
import ConnectWallet from "../connectWallet/connectWallet";
import { useWeb3React } from "@web3-react/core";

const Header: React.FC = () => {
  const context = useWeb3React<any>();
  const [navbar, setNavbar] = useState(false);
  const { connector, account } = context;

  return (
    <nav className="w-full bg-orange-400 shadow">
      <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div>
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <Link href="/">
              <a>
                <h2 className="text-2xl font-bold text-white">
                  Aristo<span className="text-orange-600">Dog</span>
                </h2>
              </a>
            </Link>
            <div className="md:hidden">
              <button
                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              navbar ? "block" : "hidden"
            }`}
          >
            <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              <li className="text-gray-600 hover:text-blue-600">
                <Link href="/">
                  <a className="cursor-pointer hover:bg-orange-600 text-white hover:text-white px-5 py-2 mr-3 rounded-md text-xl font-medium">
                    Home
                  </a>
                </Link>
              </li>
              <li className="text-gray-600 hover:text-blue-600">
                <Link href="/create">
                  <a className="cursor-pointer hover:bg-orange-600 text-white hover:text-white px-5 py-2 mr-3 rounded-md text-xl font-medium">
                    Create raffle
                  </a>
                </Link>
              </li>
              <li className="text-gray-600 hover:text-blue-600">
                <Link href="/dashboard">
                  <a className="cursor-pointer hover:bg-orange-600 text-white hover:text-white px-5 py-2 mr-3 rounded-md text-xl font-medium">
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <ConnectWallet />
              </li>
              {account && (
                <li>
                  <span
                    className=" cursor-pointer text-white"
                    onClick={() => void connector.deactivate()}
                  >
                    Log out
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
