"use client";
import React, { useEffect, useState } from "react";
import { BodhiToken_ABI } from "@/utils/abi";
import { BodhiToken_Proxy_Address } from "@/utils/contractAddress";
import { useAccount, useReadContract } from "wagmi";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { pricingData } from "./pricingData";
import { Zap, Shield } from "lucide-react";
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
            <span className="text-4xl ml-2 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Bodhi Pricing
            </span>

            <p className="text-xl text-gray-600 dark:text-gray-300">
              Flexible, pay-as-you-go pricing for your AI needs
            </p>
          </div>
          {/* <div className="grid md:grid-cols-2 gap-8">
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
          </div> */}

          <Tabs defaultValue="standard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-[4px] bg-gray-200 dark:bg-gray-700 p-1">
              <TabsTrigger
                value="standard"
                className="rounded-[4px] text-purple-600 dark:text-purple-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r from-purple-500 to-purple-600 data-[state=active]:text-white data-[state=active]:dark:text-white"
              >
                Standard
              </TabsTrigger>
              <TabsTrigger
                value="extended"
                className="rounded-[4px] text-indigo-600 dark:text-indigo-300 transition-all duration-300 data-[state=active]:bg-gradient-to-r from-indigo-500 to-indigo-600 data-[state=active]:text-white data-[state=active]:dark:text-white"
              >
                Extended
              </TabsTrigger>
            </TabsList>
            <TabsContent value="standard">
              <Card className="border-purple-200 dark:border-purple-800 rounded-[4px]">
                <CardHeader className="py-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">
                      Prompts up to 128k tokens
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Ideal for most use cases
                    </CardDescription>
                  </div>
                  <Zap className="h-12 w-12 text-purple-300" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-semibold">Input Pricing</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        $0.075 / 1M tokens
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-semibold">Output Pricing</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        $0.30 / 1M tokens
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-semibold">Basic Support</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        Ideal for most use cases
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="extended">
              <Card className="border-indigo-200 dark:border-indigo-800 rounded-[4px]">
                <CardHeader className="py-12 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">
                      Prompts longer than 128k tokens
                    </CardTitle>
                    <CardDescription className="text-indigo-100">
                      For advanced use cases
                    </CardDescription>
                  </div>
                  <Shield className="h-10 w-10 text-blue-300" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-semibold">Input Pricing</span>
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        $0.15 / 1M tokens
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-semibold">Output Pricing</span>
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        $0.60 / 1M tokens
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-semibold">Priority Support</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        Suitable for advanced use cases
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Footer />
        </div>
      </main>
    </div>
  );
}
