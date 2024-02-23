"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";

import { CardWrapper } from "@/app/components/auth/card-wrapper";
import { FormError } from "@/app/components/utilities/form-error";
import { FormSuccess } from "@/app/components/utilities/form-success";
import { enableTwoFactor } from "@/app/actions/enable-2fa";
const EnableTwoFactorClient = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const token = useSearchParams().get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }
    enableTwoFactor(token)
      .then((data) => {
        if (data?.error) {
          console.log(data.error);
          setError(data.error);
        }

        if (data?.success) {
          setSuccess(data.success);
        }
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      headerTitle="Working on it..."
      headerLabel="Confirming your verification"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!(error || success) && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};

export default EnableTwoFactorClient;
