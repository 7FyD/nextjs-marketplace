import VerifyEmail from "./VerifyEmail";
import ToggleTwoFactor from "./ToggleTwoFactor";
import ChangePassword from "./ChangePassword";
import ChangeEmail from "./ChangeEmail";
import ChangeName from "./ChangeName";
import SignOut from "./SignOut";
const settingsPage = async () => {
  return (
    <div className="flex flex-col items-center justify-center my-8 gap-12">
      error: email new-verification checks for existing user via email but
      change email sends a verification email to a "random" email
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
