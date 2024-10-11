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
      alert("Approval confirmed! Now initiating token purchase...");

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
            alert("Buy transaction submitted! Waiting for confirmation...");
          },
          onError: (error) => {
            alert(`Buy transaction failed: ${error.message}`);
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
      alert("Token purchase confirmed successfully!");
      setIsProcessing(false);
    }
  }, [isBuySuccess, refetchFUSDC, refetchBodhi]);

  const handleMintFUSDC = () => {
    try {
      setIsProcessing(true);
      alert("Please confirm the transaction in your wallet");

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
            alert("Transaction submitted! Waiting for confirmation...");
          },
          onError: (error) => {
            alert(`Transaction failed: ${error.message}`);
            setIsProcessing(false);
          },
          onSettled: () => {
            setIsProcessing(false);
          },
        },
      );
    } catch (err) {
      alert(
        `Error: ${err instanceof Error ? err.message : "Transaction failed"}`,
      );
      setIsProcessing(false);
    }
  };

  const handleSwapFUSDC = () => {
    try {
      setIsProcessing(true);
      alert("Please confirm the approval transaction in your wallet");

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
            alert(
              "Approval transaction submitted! Waiting for confirmation...",
            );
          },
          onError: (error) => {
            alert(`Approval failed: ${error.message}`);
            setIsProcessing(false);
          },
        },
      );
    } catch (err) {
      alert(
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
