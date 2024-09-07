import React from "react";
import { useState, useEffect } from "react";
import VendorNavbar from "@/components/VendorNavbar";
import Navbar from "@/components/Navbar";
import { ethers } from "ethers";

import HProduct from "@/components/HProduct";
import SureBuyABI from "@/artifacts/SureBuyABI";
import SureBuyMPABI from "@/artifacts/SureBuyMPABI";

import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, useAccount } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

const config = getDefaultConfig({
  appName: "SureBuy",
  projectId: "1",
  chains: [sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const index = () => {
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState();
  const [prov, SetProv] = useState();
  const [sign, setSign] = useState();

  const readContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    let accounts = await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const marketplaceAddress = "0x96b412d49bc204C548575Ee23C255672442CA27F";
    const mpContract = new ethers.Contract(
      marketplaceAddress,
      SureBuyMPABI,
      signer
    );
    const aresult = await mpContract.fetchSoldProducts();
    setResult(aresult);
    SetProv(provider);
    setSign(signer);
    setLoaded(true);
  };
  useEffect(() => {
    readContract();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={sepolia}
          theme={lightTheme({
            ...lightTheme.accentColors.green,
          })}
        >
          <Navbar />
          <VendorNavbar />
          {loaded &&
            result.map((r) => (
              <HProduct
                name={r[1]}
                manufacturer={r[2]}
                uri={r[6]}
                description={r[4]}
                price={ethers.formatEther(r[5].toString())}
              />
            ))}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default index;
