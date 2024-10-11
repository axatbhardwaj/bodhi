import Topup from "@/components/Topup/Topup";

export const dynamic = "force-dynamic";

export default async function Page() {

  return (
    <div className="flex flex-col min-h-screen dark:bg-gradient-to-r dark:from-primary-900 dark:via-primary-800  dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Topup/>
    </div>
  );
}
