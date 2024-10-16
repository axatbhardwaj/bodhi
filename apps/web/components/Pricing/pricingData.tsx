// pricingData.ts
import { Zap, Shield } from "lucide-react";
import { ReactNode } from "react";


export interface Pricings {
  name:string;
  description:string;
  price:number;
  features:string[];
  icon:ReactNode;
  color:string;
}

export const pricingData = (isAnnual: boolean) => ({
  standard: {
    name: "Standard",
    description: "Ideal for most use cases",
    price: isAnnual ? 99 : 9,
    features: [
      "Prompts up to 128k tokens",
      "Input: $0.075 / 1M tokens",
      "Output: $0.30 / 1M tokens",
      "Context Caching: $0.01875 / 1M tokens",
      "Basic support",
    ],
    icon: <Zap className="h-12 w-12 text-purple-600" />,
    color: "purple",
  },
    pro: {
    name: "Pro",
    description: "For advanced use cases",
    price: isAnnual ? 199 : 19,
    features: [
      "Prompts longer than 128k tokens",
      "Input: $0.15 / 1M tokens",
      "Output: $0.60 / 1M tokens",
      "Context Caching: $0.0375 / 1M tokens",
      "Priority support",
      "Advanced analytics",
    ],
    icon: <Shield className="h-12 w-12 text-blue-600" />,
    color: "blue",
  },
});
