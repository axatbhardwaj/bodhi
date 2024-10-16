import { Info } from "lucide-react";

export const Footer = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-[4px] shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Info className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold">
          Understanding Our Pay-As-You-Go Pricing
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Our flexible pricing is based on the number of tokens processed,
        allowing you to pay only for what you use. A token is a unit of text,
        roughly equivalent to 3/4 of a word. Here's what our pricing includes:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
        <li>
          <strong>Input Pricing:</strong> Covers the cost of processing your
          input text, ensuring efficient handling of your prompts.
        </li>
        <li>
          <strong>Output Pricing:</strong> Applies to the AI-generated
          responses, providing you with high-quality, contextually relevant
          content.
        </li>
        {/* <li>
        <strong>Context Caching:</strong> Allows for efficient
        processing of long conversations by caching context.
      </li> */}
      </ul>
      <div className="mt-6 p-4 bg-purple-100 dark:bg-purple-900 rounded-[4px]">
        <p className="text-purple-800 dark:text-purple-200 font-semibold">
          With our pay-as-you-go model, you're only charged for the tokens you
          process. No monthly fees or commitments – perfect for projects of any
          size.
        </p>
      </div>
    </div>
  );
};
