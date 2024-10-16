"use client";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeft, ArrowRightLeft, Coins, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

interface Props {
  balanceBodhi: any;
  balanceFUSDC: any;
}

export const Top = ({ balanceBodhi, balanceFUSDC }: Props) => {
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

      <p className="text-2xl font-bold my-4 text-center">Current Balance</p>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0 rounded-[4px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Coins className="mr-2" /> Bodhi Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(Number(balanceBodhi) / Number(1e18))?.toString() || "0"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 rounded-[4px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Wallet className="mr-2" /> FUSDC Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(Number(balanceFUSDC) / Number(1e18))?.toString() || "0"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center space-x-4 my-8">
        <div className="text-center">
          <p className="text-2xl font-bold">1 FUSDC</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">FUSDC</p>
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
