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
import { SettingsNewPasswordSchema } from "@/schemas/user-schemas";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { settingsChangePassword } from "@/app/actions/settings";
import { Button } from "@/app/components/ui/button";
import { FormError } from "@/app/components/utilities/form-error";
import { FormSuccess } from "@/app/components/utilities/form-success";
import { BeatLoader } from "react-spinners";
const ChangePassword = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const newPasswordForm = useForm<z.infer<typeof SettingsNewPasswordSchema>>({
    resolver: zodResolver(SettingsNewPasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
    },
  });
  const onNewPasswordSubmit = (
    values: z.infer<typeof SettingsNewPasswordSchema>
  ) => {
    startTransition(() => {
      settingsChangePassword(values)
        .then((data) => {
          if (data?.error) {
            console.log(data.error);
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };
  return (
    <CardWrapper headerTitle="" headerLabel="Change your password">
      <Form {...newPasswordForm}>
        <form
          onSubmit={newPasswordForm.handleSubmit(onNewPasswordSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={newPasswordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={false}
                      placeholder="*******"
                      type="password"
                      id="oldPassword"
                      autoComplete="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newPasswordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={false}
                      placeholder="********"
                      type="password"
                      id="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button disabled={false} type="submit" className="w-full">
            Change password
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

export default ChangePassword;
