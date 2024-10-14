"use client";
import LandingHeader from "@/components/Header/Landing";
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

import { Info, Check, Zap, Shield, Cpu } from "lucide-react";

export default function PricingComponent() {
  const [isAnnual, setIsAnnual] = useState(false);

  const { address } = useAccount();
  const pricingData = {
    standard: {
      name: "Standard",
      description: "Ideal for most use cases",
      price: isAnnual ? 99 : 9,
      features: [
        "Prompts up to 128k tokens",
        "Input: $0.075 / 1M tokens",
        "Output: $0.30 / 1M tokens",
        "Context Caching: $0.01875 / 1M tokens",
        "Basic support",
      ],
      icon: <Zap className="h-12 w-12 text-purple-600" />,
      color: "purple",
    },
    pro: {
      name: "Pro",
      description: "For advanced use cases",
      price: isAnnual ? 199 : 19,
      features: [
        "Prompts longer than 128k tokens",
        "Input: $0.15 / 1M tokens",
        "Output: $0.60 / 1M tokens",
        "Context Caching: $0.0375 / 1M tokens",
        "Priority support",
        "Advanced analytics",
      ],
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      color: "blue",
    },
  };

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
            {Object.entries(pricingData).map(([key, plan]) => (
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
                    {/* <div className="text-5xl font-bold mt-8">
                      ${plan.price}
                      <span className="text-xl font-normal">
                        /{isAnnual ? "year" : "month"}
                      </span>
                    </div> */}
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
                  <Button
                    className={`w-full rounded-[4px] bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:text-purple-900 transition-all px-[1rem] lg:px-[2rem]`}
                  >
                    Choose {plan.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-[4px] shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold">
                Understanding Our Pricing
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our pricing is based on the number of tokens processed. A token is
              a unit of text, roughly equivalent to 3/4 of a word. Here's what
              our pricing includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <strong>Input Pricing:</strong> Covers the cost of processing
                your input text.
              </li>
              <li>
                <strong>Output Pricing:</strong> Applies to the AI-generated
                responses.
              </li>
              <li>
                <strong>Context Caching:</strong> Allows for efficient
                processing of long conversations by caching context.
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
