import React from "react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ethers } from "ethers";
import ManufacturerNavbar from "@/components/ManufacturerNavbar";
import Request from "@/components/Request";

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
  const [name, setName] = useState();

  const readContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    let accounts = await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const marketplaceAddress = "0xc44743ec4191620132794D1A50642D264c269A1D";
    const mpContract = new ethers.Contract(
      marketplaceAddress,
      SureBuyABI,
      signer
    );
    let names = [];
    const address = await signer.getAddress();
    const aresult = await mpContract.getRequests();
    for (let i = 0; i < aresult.length; i++) {
      let bresult = await mpContract.getEntity(aresult[i][1]);
      names.push(
        <Request
          name={bresult[1]}
          address={aresult[i][1]}
          id={Number(aresult[i][0])}
          accept={handleAccept}
          decline={handleDecline}
        />
      );
    }
    setName(names);
    setResult(aresult);
    SetProv(provider);
    setSign(signer);
    setLoaded(true);
  };
  useEffect(() => {
    readContract();
  }, []);

  const handleAccept = async (id) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    let accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const marketplaceAddress = "0xc44743ec4191620132794D1A50642D264c269A1D";
    const mpContract = new ethers.Contract(
      marketplaceAddress,
      SureBuyABI,
      signer
    );
    try {
      await mpContract.confirmRequest(id);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDecline = async (id) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    let accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const marketplaceAddress = "0xc44743ec4191620132794D1A50642D264c269A1D";
    const mpContract = new ethers.Contract(
      marketplaceAddress,
      SureBuyABI,
      signer
    );
    try {
      await mpContract.declineRequest(id);
    } catch (e) {
      console.log(e);
    }
  };

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
          <ManufacturerNavbar />
          {loaded && name}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default index;
