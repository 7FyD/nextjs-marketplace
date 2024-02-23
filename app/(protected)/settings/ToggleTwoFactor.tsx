"use client";

import { useState, useTransition } from "react";
import { settingsToggleTwoFA } from "@/app/actions/settings";
import { useCurrentUser } from "@/app/hooks/use-current-user";

import { Button } from "@/app/components/ui/button";
import { FormInform } from "@/app/components/utilities/form-inform";
import { FormError } from "@/app/components/utilities/form-error";
import { FormSuccess } from "@/app/components/utilities/form-success";
import { BeatLoader } from "react-spinners";

const ToggleTwoFactor = () => {
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [inform, setInform] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  if (!user) return <p>Unauthorized.</p>;
  const [twoFactorState, setTwoFactorState] = useState<boolean>(
    user?.isTwoFactorEnabled
  );
  const sendTwoFA = () => {
    setError("");
    setSuccess("");

    startTransition(() => {
      settingsToggleTwoFA()
        .then((data) => {
          if (data?.error) {
            console.log(data.error);
            setError(data.error);
            setSuccess("");
            setInform("");
          }

          if (data?.success) {
            setSuccess(data.success);
            setError("");
            setInform("");
            setTwoFactorState(!twoFactorState);
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
        {twoFactorState ? " enabled" : " disabled"}
      </h1>
      <Button className="w-max rounded-xl" onClick={sendTwoFA}>
        {`${
          twoFactorState ? "Disable " : "Enable "
        } two factor authentification`}
      </Button>

      <div className="mt-6">
        <FormSuccess className="w-max" message={success} />
        <FormError className="w-max" message={error} />
        <FormInform className="w-max" message={inform} />
      </div>
      {isPending && (
        <div className="flex flex-col justify-center items-center gap-6 mt-6">
          <BeatLoader />
          <p className="font-extralight">Loading... </p>
        </div>
      )}
    </div>
  );
};

export default ToggleTwoFactor;
