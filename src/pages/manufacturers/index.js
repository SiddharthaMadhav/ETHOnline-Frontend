import React from "react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ethers } from "ethers";
import ManufacturerNavbar from "@/components/ManufacturerNavbar";

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
  const [rows, setRows] = useState();

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
    try {
      const address = await signer.getAddress();
      const aresult = await mpContract.getApprovedVendors(address);
      let row = [];
      for (let i = 0; i < aresult.length; i++) {
        let bresult = await mpContract.getEntity(aresult[i]);
        console.log("Inside for loop: " + aresult[i] + " " + bresult[1]);
        row.push(<h2 class="auth1">{"Name of the vendor: " + bresult[1]}</h2>);
        row.push(
          <h3 class="auth2">{"Address of the vendor: " + aresult[i]}</h3>
        );
      }
      setRows(row);
      setResult(aresult);
      SetProv(provider);
      setSign(signer);
      setLoaded(true);
    } catch (e) {
      console.log(e);
    }
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
          <ManufacturerNavbar />
          {loaded && rows}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default index;
