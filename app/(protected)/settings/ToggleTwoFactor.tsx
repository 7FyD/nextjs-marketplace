"use client";

import { startTransition, useState } from "react";
import { settingsToggleTwoFA } from "@/app/actions/settings";
import { useCurrentUser } from "@/app/hooks/use-current-user";

import { Button } from "@/app/components/ui/button";
import { FormInform } from "@/app/components/utilities/form-inform";
import { FormError } from "@/app/components/utilities/form-error";
import { FormSuccess } from "@/app/components/utilities/form-success";

const ToggleTwoFactor = () => {
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [inform, setInform] = useState<string | undefined>("");
  const sendTwoFA = () => {
    setError("");
    setSuccess("");

    startTransition(() => {
      settingsToggleTwoFA()
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            setSuccess("");
            setInform("");
          }

          if (data?.success) {
            setSuccess(data.success);
            setError(data.error);
            setInform("");
          }

          if (data?.inform) {
            setInform(data.inform);
            setSuccess("");
            setError("");
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>
        Two factor authentificator:
        {user?.isTwoFactorEnabled ? "enabled" : "disabled"}
      </h1>
      <Button className="w-max rounded-xl" onClick={sendTwoFA}>
        {`${
          user?.isTwoFactorEnabled ? "Disable " : "Enable "
        } two factor authentification`}
      </Button>

      <FormSuccess className="w-max" message={success} />
      <FormError className="w-max" message={error} />
      <FormInform className="w-max" message={inform} />
    </div>
  );
};

export default ToggleTwoFactor;
