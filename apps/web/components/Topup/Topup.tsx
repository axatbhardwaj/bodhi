"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import LandingHeader from "../Header/Landing";
import { ThreeDots } from "react-loader-spinner";

export default function Topup() {
  const [usdcAmount, setUsdcAmount] = useState("");
  const [bodhiAmount, setBodhiAmount] = useState(0);
  const [bodhiBalance, setBodhiBalance] = useState(100);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (usdcAmount === "") {
      setBodhiAmount(0);
      setLoading(false);
    } else {
      setLoading(true);
      const timeout = setTimeout(() => {
        const usdc = parseFloat(usdcAmount);
        if (!isNaN(usdc)) {
          const bodhi = usdc * 10;
          setBodhiAmount(bodhi);
        }
        setLoading(false);
      }, 500); 

      return () => clearTimeout(timeout);
    }
  }, [usdcAmount]);

  const handleTopUp = (amount: string) => {
    const usdc = parseFloat(amount);
    if (!isNaN(usdc)) {
      const bodhiAmount = usdc * 10;
      setBodhiBalance((prev) => prev + bodhiAmount);
      setUsdcAmount("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <div className="flex flex-grow justify-center items-center">
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-[4px] shadow-md">
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Top Up Your Bodhi Balance
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-purple-600"
              onClick={() => router.back()}
            >
              <ArrowLeft />
            </Button>
          </header>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Swap Fake USDC for BODHI tokens to use in your AI conversations.
          </p>

          <div className="flex items-center justify-center space-x-4 my-8">
            <div className="text-center">
              <p className="text-2xl font-bold">1 FUSDC</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Solana</p>
            </div>
            <ArrowRightLeft className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div className="text-center">
              <p className="text-2xl font-bold">10 BODHI</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bodhi Tokens</p>
            </div>
          </div>

          {/*Amount of Fake USDC to be Sent*/}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fsudc-amount" className="text-sm font-medium">
                Amount of FUSDC to swap
              </label>
              <Input
                id="fsudc-amount"
                placeholder="Enter FUSDC amount"
                type="number"
                min="0"
                step="0.1"
                value={usdcAmount}
                onChange={(e) => setUsdcAmount(e.target.value)}
                className="outline-none rounded-[4px]"
              />
            </div>

            {/* Receive Bodhi Tokens Amount */}
            <div className="space-y-2">
              <label htmlFor="bodhi-amount" className="text-sm font-medium">
                Equivalent Bodhi Tokens
              </label>
              <div className="relative">
                <Input
                  id="bodhi-amount"
                  placeholder="Bodhi amount"
                  value={loading ? "" : bodhiAmount.toString()}
                  readOnly
                  className="outline-none rounded-[4px] cursor-not-allowed"
                />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ThreeDots height="30" width="30" color="white" />
                  </div>
                )}
              </div>
            </div>

            <Button
              className="w-full rounded-[4px] bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:text-purple-900 transition-all"
              size="lg"
              onClick={() => handleTopUp(usdcAmount)}
            >
              Swap and Top Up
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-700 dark:text-gray-400">
              Your current Bodhi balance:{" "}
              <span className="font-bold text-green-600 dark:text-green-400">
                {bodhiBalance} BODHI
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
