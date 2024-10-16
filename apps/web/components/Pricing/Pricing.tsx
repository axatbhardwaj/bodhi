"use client";
import React, { useEffect, useState } from "react";
import { BodhiToken_ABI } from "@/utils/abi";
import { BodhiToken_Proxy_Address } from "@/utils/contractAddress";
import { useAccount, useReadContract } from "wagmi";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {  Pricings, pricingData } from "./pricingData";
import { Check } from "lucide-react";
import { Footer } from "./Footer";
import PricingHeader from "../Header/PricingHeader";

export default function PricingComponent() {
  const [isAnnual, setIsAnnual] = useState(false);
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

  const pricing = pricingData(isAnnual);

  return (
    <div>
      <PricingHeader amount={balanceBodhi} />
      <main className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              Bodhi Pricing Plans
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose the perfect plan for your AI needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(pricing).map(([key, plan]: [string, Pricings]) => (
              <Card
                key={key}
                className={`flex flex-col rounded-[4px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white dark:bg-gray-800 border-${plan.color}-200 dark:border-${plan.color}-800`}
              >
                <div
                  className={`bg-gradient-to-r from-${plan.color}-600 to-${plan.color}-400 py-6 text-white`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-3xl font-bold">
                        {plan.name}
                      </CardTitle>
                      {plan.icon}
                    </div>
                    <CardDescription className={`text-${plan.color}-100 mb-4`}>
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="flex-grow p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check
                          className={`h-5 w-5 text-${plan.color}-500 mr-2 flex-shrink-0`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-6">
                  <Button className="w-full bg-purple-600 text-white">
                    Choose {plan.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
         <Footer/>
        </div>
      </main>
    </div>
  );
}
