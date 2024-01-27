import ToggleTwoFactor from "./ToggleTwoFactor";
import ChangePasswordClient from "./ChangePassword";
import SignOutClient from "./SignOut";

const settingsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center my-8 gap-12">
      <ToggleTwoFactor />
      <ChangePasswordClient />
      <SignOutClient />
    </div>
  );
};

export default settingsPage;
