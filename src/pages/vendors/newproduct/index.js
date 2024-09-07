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
    string3: "",
    string4: "",
    number: "",
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
    const provider = new ethers.BrowserProvider(window.ethereum);
    let accounts = await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const marketplaceAddress = "0x96b412d49bc204C548575Ee23C255672442CA27F";
    const mpContract = new ethers.Contract(
      marketplaceAddress,
      SureBuyMPABI,
      signer
    );
    try {
      const aresult = await mpContract.sellProduct(
        formData.string1,
        formData.string2,
        formData.string3,
        formData.string4,
        parseInt(formData.number)
      );
    } catch (e) {
      console.log(e);
    } finally {
      setFormData({});
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
                Name:
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
                Manufacturer address:
                <input
                  type="text"
                  name="string2"
                  value={formData.string2}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Description:
                <input
                  type="text"
                  name="string3"
                  value={formData.string3}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Photo URI:
                <input
                  type="text"
                  name="string4"
                  value={formData.string4}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Price in wei:
                <input
                  type="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </label>
            </div>
            <button type="submit">Submit</button>
          </form>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default index;
