/** @format */

"use client";

import { geminiStore } from "@/actions/storePrompt";
import axios from "axios";
import { ArrowUp, Image, Paperclip, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PromptBox from "./PromtBox";
import MessageBox from "./MessageBox";
import { promptMessages, promptType } from "./prompt";
import { tokenToBodhiCost } from "@/utils/calculateCost";
import ChatHeader from "../Header/ChatHeader";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import toast from "react-hot-toast";
import { BodhiToken_ABI, ServiceMarketplace_ABI } from "@/utils/abi";
import {
  BodhiToken_Proxy_Address,
  ServiceMarketplace_Proxy_Address,
} from "@/utils/contractAddress";

export default function Chat({
  userId,
  name,
}: {
  userId: string;
  name: string | null | undefined;
}) {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [approvalTxHash, setApprovalTxHash] = useState<string>("");
  const [messages, setMessages] = useState<
    { type: "prompt" | "response"; content: string }[]
  >([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [inputTokenCount, setInputTokenCount] = useState(0);
  const [outputTokenCount, setOutputTokenCount] = useState(0);
  const [generatedResponse, setGeneratedResponse] = useState<{
    type: "response";
    content: string;
  }>();

  const { writeContract } = useWriteContract();
  const submitButtonRef: any = useRef();
  const { address } = useAccount();

  const scrollToBottomRef: any = useRef(null);

  const isEmpty = (value: string) => value.trim().length === 0;

  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalTxHash as `0x${string}`,
    });

  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

  const { data: balanceBodhi, refetch: refetchBodhi } = useReadContract({
    abi: BodhiToken_ABI,
    address: BodhiToken_Proxy_Address,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (isTxSuccess) {
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
      setMessages((prevMessages) => [...prevMessages, generatedResponse!]);
    }
  }, [isTxSuccess, refetchBodhi]);

  useEffect(() => {
    if (isApprovalSuccess) {
      toast.success("Approval confirmed! Now initiating Bodhi transfer...");

      writeContract(
        {
          abi: ServiceMarketplace_ABI,
          address: ServiceMarketplace_Proxy_Address,
          functionName: "processTransaction",
          args: [1, inputTokenCount, outputTokenCount],
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
        },
      );
    }
  }, [isApprovalSuccess]);

  const handleChatSend = async () => {
    setInput("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "prompt", content: input },
    ]);
    const res = await axios({
      url: `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/v1/gemini/prompt`,
      method: "POST",
      data: {
        query: {
          prompt: input,
        },
      },
    });
    setInputTokenCount(res.data.response.usageMetadata.promptTokenCount);
    setOutputTokenCount(res.data.response.usageMetadata.candidatesTokenCount);

    setGeneratedResponse({
      type: "response",
      content: res.data.response.promptResult,
    });

    await geminiStore(
      input,
      res.data.response.promptResult,
      res.data.response.usageMetadata.promptTokenCount,
      res.data.response.usageMetadata.candidatesTokenCount,
      userId,
    );
    const bodhiPayable = tokenToBodhiCost(
      res.data.response.usageMetadata.promptTokenCount,
      res.data.response.usageMetadata.candidatesTokenCount,
    );

    try {
      setIsProcessing(true);
      toast("Please confirm the approval transaction in your wallet");

      writeContract(
        {
          abi: BodhiToken_ABI,
          address: BodhiToken_Proxy_Address,
          functionName: "approve",
          args: [ServiceMarketplace_Proxy_Address, bodhiPayable],
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

    scrollToBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTokenCount = async () => {
    const res = await axios({
      url: `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/v1/gemini/tokencount`,
      method: "POST",
      data: {
        query: {
          prompt: input,
        },
      },
    });
    setTokenCount(res.data.response.totalTokens);
  };

  const handleEnterKey = (e: any) => {
    if (e.key === "Enter") {
      if (e.shiftKey || isEmpty(input)) {
        e.preventDefault();
        setInput((prevInput) => prevInput + "\n");
      } else {
        e.preventDefault();
        submitButtonRef.current.click();
      }
    }
  };

  const isLoading = isProcessing || isApprovalConfirming || isTxConfirming;

  return (
    <div>
      <ChatHeader
        handleTokenUsage={handleTokenCount}
        isDisabled={isEmpty(input)}
        token={tokenCount}
        amount={balanceBodhi}
      />
      <main className="flex-1">
        <div className="w-full min-h-screen flex flex-col text-white overflow-hidden">
          <div className="mt-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full py-10">
            {messages?.length === 0 && (
              <div className="space-y-8 mb-8 pb-40 px-6">
                <h1 className="text-center font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-600 dark:text-white">
                  Hi there, <span className="text-[#a855f7]">{name}</span>{" "}
                  <br /> What{" "}
                  <span className="text-[#38bdf8]">would like to know</span>?
                </h1>

                <p className="text-center text-gray-400 text-sm sm:text-base">
                  Use one of the most common prompts below or use your own to
                  begin
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {promptMessages.length > 0 ? (
                    promptMessages.map((prompt: promptType, index: number) => (
                      <div
                        className="bg-white dark:bg-gray-800 rounded-[4px] p-4 text-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                        key={index}
                        onClick={() => {
                          setInput(prompt.text);
                        }}
                      >
                        <p className="text-md md:text-lg text-gray-600 dark:text-white">
                          {prompt.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div>No prompts available</div>
                  )}
                </div>
              </div>
            )}

            {/* Display Prompts */}
            {messages?.length > 0 && (
              <div className="flex-grow overflow-auto w-full mb-20 pb-20 px-6">
                {messages?.map((message, index) =>
                  message?.type === "prompt" ? (
                    <PromptBox key={index} prompt={message?.content} />
                  ) : (
                    <MessageBox key={index} message={message.content} />
                  ),
                )}
              </div>
            )}
            <div ref={scrollToBottomRef} className="h-[100px]"></div>

            {/* Input box section */}
            <div className="w-full">
              <div className="fixed bottom-0 left-0 right-0 px-6 md:px-0">
                {messages?.length > 0 && (
                  <div className="flex justify-center mb-4 mt-4">
                    <button className="flex items-center text-gray-400 hover:text-white space-x-2">
                      <RefreshCw />
                      <span onClick={() => setMessages([])}>
                        Refresh Prompts
                      </span>
                    </button>
                  </div>
                )}
                <div className="max-w-3xl mx-auto flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 p-4 mb-2 rounded-[4px] border border-gray-400">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={4}
                    placeholder="Ask whatever you want..."
                    className="bg-transparent flex-grow text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none text-md md:text-lg"
                    onKeyDown={handleEnterKey}
                  />
                  <button
                    ref={submitButtonRef}
                    className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 md:p-3 rounded-full"
                    onClick={handleChatSend}
                    disabled={isEmpty(input) || isLoading}
                  >
                    <ArrowUp />
                  </button>
                </div>
                {/* <div className="dark:text-white text-black">CURRENT BALANCE: {Number(balanceBodhi)/Number(1e18)}</div> */}
              </div>

              {false && (
                <div className="flex items-center justify-between w-full text-gray-400 mt-2">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2">
                      <Paperclip />
                      <span>Add Attachment</span>
                    </button>
                    <button className="flex items-center space-x-2">
                      <Image />
                      <span>Use Image</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
