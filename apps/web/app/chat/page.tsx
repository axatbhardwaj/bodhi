import { checkAuth } from "@/actions/checkAuth";
import { getName } from "@/actions/getUserInfo";
import Chat from "@/components/Chat";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session: any = await checkAuth();
  const userId = session.user.id;
  const name = await getName(userId);
  return (
    <div className="flex flex-col min-h-screen dark:bg-gradient-to-r dark:from-primary-900 dark:via-primary-800  dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Chat userId={userId} name={name} />
    </div>
  );
}
