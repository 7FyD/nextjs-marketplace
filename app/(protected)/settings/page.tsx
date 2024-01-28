import ToggleTwoFactor from "./ToggleTwoFactor";
import ChangePassword from "./ChangePassword";
import SignOut from "./SignOut";
import VerifyEmail from "./VerifyEmail";
const settingsPage = async () => {
  return (
    <div className="flex flex-col items-center justify-center my-8 gap-12">
      <VerifyEmail />
      <ToggleTwoFactor />
      <ChangePassword />
      <SignOut />
    </div>
  );
};

export default settingsPage;
