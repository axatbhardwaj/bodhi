import React from "react";

import PricingComponent from "@/components/Pricing/Pricing";

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gradient-to-r dark:from-primary-900 dark:via-primary-800  dark:to-gray-800 text-gray-900 dark:text-gray-100 transitin-colors duration-500">
      <PricingComponent />
    </div>
  );
}
