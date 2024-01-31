"use client";

import { startTransition, useState, useTransition } from "react";
import { settingsVerifyEmail } from "@/app/actions/settings";
import { useCurrentUser } from "@/app/hooks/use-current-user";

import { Button } from "@/app/components/ui/button";
import { FormInform } from "@/app/components/utilities/form-inform";
import { FormError } from "@/app/components/utilities/form-error";
import { FormSuccess } from "@/app/components/utilities/form-success";
import { BeatLoader } from "react-spinners";

const VerifyEmail = () => {
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [inform, setInform] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const verifyEmail = () => {
    setError("");
    setSuccess("");

    startTransition(() => {
      settingsVerifyEmail()
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            setInform("");
          }

          if (data?.inform) {
            setInform(data.inform);
            setError("");
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>
        Email:
        {user?.emailVerified ? " verified" : " not verified"}
      </h1>
      {!user?.emailVerified && (
        <Button className="w-max rounded-xl" onClick={verifyEmail}>
          Send verification email
        </Button>
      )}
      <FormSuccess className="w-max" message={success} />
      <FormError className="w-max" message={error} />
      <FormInform className="w-max" message={inform} />
      {isPending && (
        <div className="flex flex-col justify-center items-center gap-6 mt-6">
          <BeatLoader />
          <p className="font-extralight">Loading... </p>
        </div>
      )}
    </div>
  );
};
export default VerifyEmail;
