import VerifyEmail from "./VerifyEmail";
import ToggleTwoFactor from "./ToggleTwoFactor";
import ChangePassword from "./ChangePassword";
import ChangeEmail from "./ChangeEmail";
import ChangeName from "./ChangeName";
import SignOut from "./SignOut";
const settingsPage = async () => {
  return (
    <div className="flex flex-col items-center justify-center my-8 gap-12">
      <VerifyEmail />
      <ToggleTwoFactor />
      <ChangeName />
      <ChangeEmail />
      <ChangePassword />
      <SignOut />
    </div>
  );
};

export default settingsPage;
