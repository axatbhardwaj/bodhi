"use client";

import { useState, useEffect } from "react";
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
import toast from "react-hot-toast";

export default function TopUp() {
  const [mintFUSDC, setMintFUSDC] = useState<number>();
  const [swapFUSDC, setSwapFUSDC] = useState<number>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [approvalTxHash, setApprovalTxHash] = useState<string>("");

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

  const isLoading = isProcessing || isApprovalConfirming || isBuyConfirming;

  return (
    <>
      <div>
        <div>Your Balances:</div>
        <div>FUSDC: {balanceFUSDC?.toString() || "0"}</div>
        <div>Bodhi: {balanceBodhi?.toString() || "0"}</div>
      </div>
      <div>
        <div>Mint Your Fake USDC Here:</div>
        <input
          type="number"
          value={mintFUSDC}
          onChange={(e) => setMintFUSDC(Number(e.target.value))}
          disabled={isLoading}
        />
        {address && (
          <button onClick={handleMintFUSDC} disabled={isLoading}>
            {isLoading ? "Processing..." : "Mint FUSDC"}
          </button>
        )}
      </div>
      <div>
        <div>Buy Bodhi Using FUSDC: conversion rate: 1 FUSDC = 10 Bodhi</div>
        <input
          type="number"
          value={swapFUSDC}
          onChange={(e) => setSwapFUSDC(Number(e.target.value))}
          disabled={isLoading}
        />
        {address && (
          <button onClick={handleSwapFUSDC} disabled={isLoading}>
            {isLoading ? "Processing..." : "Swap FUSDC to Bodhi"}
          </button>
        )}
      </div>
    </>
  );
}
