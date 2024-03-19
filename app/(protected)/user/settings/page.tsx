import SettingsClient from "./SettingsClient";
import { currentUser } from "@/lib/user";
import { getUserById } from "@/data/user";
import Link from "next/link";
const SettingsPage = async () => {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center text-center gap-24">
        <h1 className="text-red-500 font-semibold">Unauthorized.</h1>
        <Link
          href={"/auth/login"}
          className="hover:cursor-pointer hover:underline"
        >
          Go to login.
        </Link>
      </div>
    );
  }
  const dbUser = await getUserById(user.id);
  return <SettingsClient user={dbUser} />;
};

export default SettingsPage;
