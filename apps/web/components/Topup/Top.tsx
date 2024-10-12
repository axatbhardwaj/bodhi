"use client";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const Top = () => {
  const router = useRouter();
  return (
    <div>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bodhi Tokens
          </p>
        </div>
      </div>
    </div>
  );
};
