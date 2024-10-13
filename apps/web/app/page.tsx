import { Home as HomeComponent } from "@/components/Home/Home";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gradient-to-r dark:from-primary-900 dark:via-primary-800  dark:to-gray-800 text-gray-900 dark:text-gray-100 transitin-colors duration-500">
     <HomeComponent/>
    </div>
  );
}
