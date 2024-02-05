"use client";

import { CardWrapper } from "@/app/components/auth/card-wrapper";
import { Input } from "@/app/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsChangeEmailSchema } from "@/schemas";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { settingsChangeEmail } from "@/app/actions/settings";
import { Button } from "@/app/components/ui/button";
import { FormError } from "@/app/components/utilities/form-error";
import { FormInform } from "@/app/components/utilities/form-inform";
import { BeatLoader } from "react-spinners";
const ChangeEmail = () => {
  const [error, setError] = useState<string | undefined>("");
  const [inform, setInform] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const changeEmailForm = useForm<z.infer<typeof SettingsChangeEmailSchema>>({
    resolver: zodResolver(SettingsChangeEmailSchema),
    defaultValues: {
      email: "",
    },
  });
  const changeEmailFormSubmit = (
    values: z.infer<typeof SettingsChangeEmailSchema>
  ) => {
    startTransition(() => {
      settingsChangeEmail(values)
        .then((data) => {
          if (data?.error) {
            console.log(data.error);
            setError(data.error);
          }

          if (data?.inform) {
            setInform(data.inform);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };
  return (
    <CardWrapper headerTitle="" headerLabel="Change your email">
      <Form {...changeEmailForm}>
        <form
          onSubmit={changeEmailForm.handleSubmit(changeEmailFormSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={changeEmailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={false}
                      placeholder="harvey.specter@pearsonspecter.com"
                      type="email"
                      id="newEmail"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormInform message={inform} />
          <FormError message={error} />
          <Button disabled={false} type="submit" className="w-full">
            Change email
          </Button>
          {isPending && (
            <div className="flex flex-col justify-center items-center gap-6 mt-6">
              <BeatLoader />
              <p className="font-extralight">Loading... </p>
            </div>
          )}
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ChangeEmail;
