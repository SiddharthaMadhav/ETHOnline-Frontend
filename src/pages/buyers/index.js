import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BuyerNavbar from "@/components/BuyerNavbar";
import { ethers } from "ethers";
import Product from "@/components/Product";
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
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const marketplaceAddress = "0x96b412d49bc204C548575Ee23C255672442CA27F";
      const mpContract = new ethers.Contract(
        marketplaceAddress,
        SureBuyMPABI,
        provider
      );
      const aresult = await mpContract.fetchAllProducts();
      console.log(aresult[0][5]);
      setLoaded(true);
      setResult(aresult);
      SetProv(provider);
      setSign(signer);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    readContract();
  }, []);

  const handleSubmit = async (idToBuy, priceToBuy) => {
    const marketplaceAddress = "0x96b412d49bc204C548575Ee23C255672442CA27F";
    const mpContract = new ethers.Contract(
      marketplaceAddress,
      SureBuyMPABI,
      sign
    );
    try {
      await mpContract.buyProduct(idToBuy, {
        value: ethers.parseEther(priceToBuy),
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            initialChain={sepolia}
            theme={lightTheme({
              ...lightTheme.accentColors.green,
            })}
          >
            <Navbar />
            <BuyerNavbar />
            {loaded &&
              result.map((r) => (
                <Product
                  onClick={handleSubmit}
                  id={r[0]}
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
    </div>
  );
};

export default index;
