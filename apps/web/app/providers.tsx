"use client";

// import AppWalletProvider from "@/components/AppWalletProvider";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider>
              {/* <AppWalletProvider> */}
              <ThemeProvider attribute="class" defaultTheme="dark">
                {children}
              </ThemeProvider>
              {/* </AppWalletProvider> */}
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </SessionProvider>
    </>
  );
}
