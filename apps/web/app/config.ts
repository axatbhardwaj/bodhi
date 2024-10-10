/* eslint-disable turbo/no-undeclared-env-vars */
import { http, createConfig } from "wagmi";
import { baseSepolia, mainnet, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(
      `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    ),
  },
});
