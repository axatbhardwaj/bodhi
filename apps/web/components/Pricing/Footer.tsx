import { Info } from "lucide-react"

export const Footer = () => {
    return  <div className="bg-white dark:bg-gray-800 p-6 rounded-[4px] shadow-lg">
    <div className="flex items-center space-x-2 mb-4">
      <Info className="h-5 w-5 text-blue-500" />
      <h2 className="text-xl font-semibold">
        Understanding Our Pricing
      </h2>
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      Our pricing is based on the number of tokens processed. A token is
      a unit of text, roughly equivalent to 3/4 of a word. Here's what
      our pricing includes:
    </p>
    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
      <li>
        <strong>Input Pricing:</strong> Covers the cost of processing
        your input text.
      </li>
      <li>
        <strong>Output Pricing:</strong> Applies to the AI-generated
        responses.
      </li>
      <li>
        <strong>Context Caching:</strong> Allows for efficient
        processing of long conversations by caching context.
      </li>
    </ul>
  </div>
}