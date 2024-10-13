"use client";
import { useEffect } from "react";
import { FAQ } from "../FAQ/FAQ";
import { FeaturesComp } from "../Features/FeaturesComp";
import Footer from "../Footer";
import LandingHeader from "../Header/Landing";
import Hero from "../Hero";
import { HowItWorks } from "../HowItWorks/HowItWorks";
import { BodhiToken_ABI } from "@/utils/abi";
import { BodhiToken_Proxy_Address } from "@/utils/contractAddress";
import { useAccount, useReadContract } from "wagmi";

export const Home = () => {
  const { address } = useAccount();

  const { data: balanceBodhi, refetch: refetchBodhi } = useReadContract({
    abi: BodhiToken_ABI,
    address: BodhiToken_Proxy_Address,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (address) {
      refetchBodhi();
    }
  }, [address, refetchBodhi]);

  return (
    <div>
      <LandingHeader amount={balanceBodhi} />
      <main className="flex-1">
        <Hero />
        <FeaturesComp />
        <HowItWorks />
        <FAQ />
        {/* <CallOut /> */}
      </main>
      <Footer />
    </div>
  );
};
