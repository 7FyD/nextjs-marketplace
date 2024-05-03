"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { newVerification } from "@/app/actions/new-verification";
import { FormError } from "@/components/utilities/form-error";
import { FormSuccess } from "@/components/utilities/form-success";

const NewVerificationClient = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const token = useSearchParams().get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }
    newVerification(token)
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

export default NewVerificationClient;
