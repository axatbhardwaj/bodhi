"use client";

// import AppWalletProvider from "@/components/AppWalletProvider";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider
             customTheme={{
              "--ck-font-family": '"Comic Sans MS", "Comic Sans", cursive',
              "--ck-border-radius": 42,
              "--ck-accent-color": "#00D54B",
    "--ck-accent-text-color": "#ffffff",
            }}
            >
              {/* <AppWalletProvider> */}
              <ThemeProvider attribute="class" defaultTheme="dark">
                {children}
                <Toaster
                  toastOptions={{
                    duration: 2000,
                    style: {
                      borderRadius: "10px",
                      background: "#333",
                      color: "#fff",
                    },
                  }}
                />
              </ThemeProvider>
              {/* </AppWalletProvider> */}
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </SessionProvider>
    </>
  );
}
