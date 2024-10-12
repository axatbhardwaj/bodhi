"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { ThreeDots } from "react-loader-spinner";
import SwapHeader from "../Header/SwapHeader";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { FUSDC_ABI, TokenDistribution_ABI, BodhiToken_ABI } from "@/utils/abi";
import {
  FUSDC_Address,
  TokenDistribution_Proxy_Address,
  BodhiToken_Proxy_Address,
} from "@/utils/contractAddress";
import toast from "react-hot-toast"
import { Top } from "./Top";
import { Bottom } from "./Bottom";

export default function Topup() {
  const [mintFUSDC, setMintFUSDC] = useState<number>();
  const [swapFUSDC, setSwapFUSDC] = useState<number>();
  const [bodhiAmount,setBodhiAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [approvalTxHash, setApprovalTxHash] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { writeContract } = useWriteContract();

  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalTxHash as `0x${string}`,
    });

  const { isLoading: isBuyConfirming, isSuccess: isBuySuccess } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

  const { address } = useAccount();

  const { data: balanceFUSDC, refetch: refetchFUSDC } = useReadContract({
    abi: FUSDC_ABI,
    address: FUSDC_Address,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: balanceBodhi, refetch: refetchBodhi } = useReadContract({
    abi: BodhiToken_ABI,
    address: BodhiToken_Proxy_Address,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (isApprovalSuccess && swapFUSDC) {
      toast.success("Approval confirmed! Now initiating token purchase...");

      writeContract(
        {
          abi: TokenDistribution_ABI,
          address: TokenDistribution_Proxy_Address,
          functionName: "buyTokens",
          args: [swapFUSDC],
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash);
            toast.success(
              "Buy transaction submitted! Waiting for confirmation...",
            );
          },
          onError: (error) => {
            toast.error(`Buy transaction failed: ${error.message}`);
            setIsProcessing(false);
          },
        },
      );
    }
  }, [isApprovalSuccess, swapFUSDC]);

  useEffect(() => {
    if (isBuySuccess) {
      refetchFUSDC();
      refetchBodhi();
      toast.success(
        <div>
          Transaction confirmed successfully!{" "}
          <a
            href={`https://base-sepolia.blockscout.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            View on Explorer
          </a>
        </div>,
        {
          duration: 3000,
        },
      );
      setIsProcessing(false);
    }
  }, [isBuySuccess, refetchFUSDC, refetchBodhi]);

  const handleMintFUSDC = () => {
    try {
      setIsProcessing(true);
      toast("Please confirm the transaction in your wallet");

      writeContract(
        {
          abi: FUSDC_ABI,
          address: FUSDC_Address,
          functionName: "mint",
          args: [address, mintFUSDC],
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash);
            toast.success("Transaction submitted! Waiting for confirmation...");
          },
          onError: (error) => {
            toast.error(`Transaction failed: ${error.message}`);
            setIsProcessing(false);
          },
          onSettled: () => {
            setIsProcessing(false);
          },
        },
      );
    } catch (err) {
      toast.error(
        `Error: ${err instanceof Error ? err.message : "Transaction failed"}`,
      );
      setIsProcessing(false);
    }
  };

  const handleSwapFUSDC = () => {
    try {
      setIsProcessing(true);
      toast("Please confirm the approval transaction in your wallet");

      writeContract(
        {
          abi: FUSDC_ABI,
          address: FUSDC_Address,
          functionName: "approve",
          args: [TokenDistribution_Proxy_Address, swapFUSDC],
        },
        {
          onSuccess: (hash) => {
            setApprovalTxHash(hash);
            toast.success(
              "Approval transaction submitted! Waiting for confirmation...",
            );
          },
          onError: (error) => {
            toast.error(`Approval failed: ${error.message}`);
            setIsProcessing(false);
          },
        },
      );
    } catch (err) {
      toast.error(
        `Error: ${err instanceof Error ? err.message : "Transaction failed"}`,
      );
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (swapFUSDC === null || swapFUSDC?.toString()===""||swapFUSDC===undefined) {
      setBodhiAmount(0);
      setLoading(false);
    } else {
      setLoading(true);
      const timeout = setTimeout(() => {
        const usdc = parseFloat(swapFUSDC.toString());
        if (!isNaN(usdc)) {
          const bodhi = usdc * 10;
          setBodhiAmount(bodhi);
        }
        setLoading(false);
      }, 500); 

      return () => clearTimeout(timeout);
    }
  }, [swapFUSDC]);

  const handleSetMintUsdc = (e:any) => {
    if (/^\d*\.?\d*$/.test(e.target.value)) {
      setMintFUSDC(Number(e.target.value));
    }
   else if (!e.target.value || !/^\d*\.?\d*$/.test(e.target.value)) {
      setMintFUSDC(0);
      return;
    }
  }

  const handleSetSwapUsdc = (e:any) => {
    if (/^\d*\.?\d*$/.test(e.target.value)) {
      setSwapFUSDC(Number(e.target.value));
    }
   else if (!e.target.value || !/^\d*\.?\d*$/.test(e.target.value)) {
      setSwapFUSDC(0);
      return;
    }
  }

  const isLoading = isProcessing || isApprovalConfirming || isBuyConfirming;
  const mintButtonLoading = isProcessing || isApprovalConfirming || isBuyConfirming|| (!mintFUSDC) || (mintFUSDC===0 || mintFUSDC<0);
  const SwapButtonLoading = isProcessing || isApprovalConfirming || isBuyConfirming|| (!swapFUSDC) || (swapFUSDC===0 || swapFUSDC<0);


  return (
    <div className="min-h-screen flex flex-col">
      <SwapHeader amount={balanceBodhi}/>
      <div className="flex flex-grow justify-center items-center">
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-[4px] shadow-md">
          <Top/>
          {/*Amount of Fake USDC you want to mint*/}
          <div className="space-y-4">

          <div className="space-y-2">
              <label htmlFor="fsudc-amount" className="text-sm font-medium">
                Amount of FUSDC to mint
              </label>
              <Input
                id="fsudc-amount"
                type="number"
                value={mintFUSDC}
                min={0}
                step={0.1}
                 placeholder="Enter FUSDC amount"
                onChange={(e)=>{handleSetMintUsdc(e)}}
                disabled={isLoading}
                className="outline-none rounded-[4px]"
              />
            </div>


            <Button
              className="w-full rounded-[4px] bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:text-purple-900 transition-all"
              size="lg"
              onClick={handleMintFUSDC}
              disabled={mintButtonLoading}
            >
              Mint FUSDC
            </Button>

  {/*Amount of Fake USDC you want to swap*/}
            <div className="space-y-2">
              <label htmlFor="fsudc-amount" className="text-sm font-medium">
                Amount of fusdc you want to swap
              </label>
              <Input
                id="fsudc-amount"
                placeholder="Enter FUSDC amount"
                type="number"
                step={0.1}
                value={swapFUSDC}
                onChange={(e) => handleSetSwapUsdc(e)}
                disabled={isLoading}
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
              onClick={handleSwapFUSDC}
              disabled={SwapButtonLoading}
            >
              Swap and Top Up
            </Button>
          </div>
         <Bottom balanceBodhi={balanceBodhi} balanceFUSDC={balanceFUSDC} />
        </div>
      </div>
    </div>
  );
}
