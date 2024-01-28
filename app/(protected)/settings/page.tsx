import ToggleTwoFactor from "./ToggleTwoFactor";
import ChangePasswordClient from "./ChangePassword";
import SignOutClient from "./SignOut";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { currentUser } from "@/lib/user";

const settingsPage = async () => {
  const user = await currentUser();
  console.log(user);
  return (
    <div className="flex flex-col items-center justify-center my-8 gap-12">
      <ToggleTwoFactor />
      <ChangePasswordClient />
      <SignOutClient />
    </div>
  );
};

export default settingsPage;
