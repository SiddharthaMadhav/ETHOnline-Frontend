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
  const [formData, setFormData] = useState({
    string1: "",
    string2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      let accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const marketplaceAddress = "0xc44743ec4191620132794D1A50642D264c269A1D";
      const mpContract = new ethers.Contract(
        marketplaceAddress,
        SureBuyABI,
        signer
      );
      await mpContract.registerAsVendor(formData.string1, formData.string2);
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
          <VendorNavbar />
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Name of vendor:
                <input
                  type="text"
                  name="string1"
                  value={formData.string1}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                PAN of vendor:
                <input
                  type="text"
                  name="string2"
                  value={formData.string2}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <button type="submit">Register</button>
          </form>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default index;
