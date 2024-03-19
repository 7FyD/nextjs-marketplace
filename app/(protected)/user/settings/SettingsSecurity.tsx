"use client";

import { Button } from "@/app/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/app/components/ui/hover-card";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { securitySettingsSchema } from "@/schemas/settings-schemas";
import {
  settingsSendTwoFactorEmail,
  settingsSendVerifyEmail,
} from "@/app/actions/settings";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

interface SettingsInterface {
  user: User | null;
}

const SettingsSecurity: React.FC<SettingsInterface> = ({ user }) => {
  const isOAuth = user?.isOAuth ? true : false;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isTwoFactorPending, startTwoFactorTransition] = useTransition();
  const [isEmailConfirmedPending, startEmailConfirmedTransition] =
    useTransition();
  const [isFormPending, startFormTransition] = useTransition();
  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      email: user?.email || "",
      password: "",
    },
  });

  const onGeneralFormSubmit = (
    values: z.infer<typeof securitySettingsSchema>
  ) => {
    startFormTransition(() => {
      console.log(values);
    });
  };

  const verifyEmail = () => {
    startEmailConfirmedTransition(() => {
      settingsSendVerifyEmail()
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
          }
          if (data.error) {
            toast.error(data.error);
            console.log(data.error);
          }
        })
        .catch((error) => console.log(error));
    });
  };

  const [twoFactorButton, setTwoFactorButton] = useState<string>(
    user?.isTwoFactorEnabled ? "Disable 2FA" : "Enable 2FA"
  );
  const [twoFactorEmailSent, setTwoFactorEmailSent] = useState<boolean>(false);
  const toggleTwoFactor = () => {
    startTwoFactorTransition(() => {
      settingsSendTwoFactorEmail()
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
            setTwoFactorButton("Email confirmation sent");
            setTwoFactorEmailSent(true);
          }
          if (data.error) {
            toast.error(data.error);
            setTwoFactorButton(
              user?.isTwoFactorEnabled ? "Disable 2FA" : "Enable 2FA"
            );
            console.log(data.error);
          }
        })
        .catch((error) => {
          toast.error(`An error occured: ${error}`);
          setTwoFactorButton(
            user?.isTwoFactorEnabled ? "Disable 2FA" : "Enable 2FA"
          );
          console.log(error);
        });
    });
  };

  return (
    <div>
      <h2 className="mt-4 text-center font-semibold px-6">General info</h2>
      <Form {...securityForm}>
        <form onSubmit={securityForm.handleSubmit(onGeneralFormSubmit)}>
          <div
            className={`mt-4 gap-8 p-6 mb-16 grid ${
              isDesktop ? "ml-14 mr-14 grid-cols-2" : "grid-cols-1"
            }`}
          >
            <div className="flex flex-col gap-2">
              <p className="text-center">Email verification status:</p>
              {!!user?.emailVerified ? (
                <p className="mx-auto">Verified.</p>
              ) : (
                <>
                  <Button
                    disabled={isEmailConfirmedPending}
                    className="mx-auto block px-6"
                    type="button"
                    onClick={() => verifyEmail()}
                  >
                    Send verification mail
                  </Button>
                  {isEmailConfirmedPending && (
                    <BeatLoader className="mx-auto" />
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-center">Two factor Authentificator</p>
              <Button
                disabled={isTwoFactorPending || twoFactorEmailSent}
                className="mx-auto block px-6"
                type="button"
                onClick={() => toggleTwoFactor()}
              >
                {twoFactorButton}
              </Button>
              {isTwoFactorPending && <BeatLoader className="mx-auto" />}
            </div>
            <FormField
              disabled={isOAuth}
              control={securityForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <Label className="h-min">Email</Label>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                  </div>
                  <FormMessage />
                  {isOAuth && (
                    <FormDescription>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="link"
                            className="p-0 h-max inline hover:cursor-default"
                          >
                            Why can't I change this?
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">
                            You cannot change the email associated with this
                            account.
                            <br /> <br />
                            Your account uses a third party application for
                            authentification.
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            <FormField
              disabled={isOAuth}
              control={securityForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-12">
                  <div>
                    <Label className="h-min">Password</Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="******"
                        displayShowPassword={!isOAuth && !!field.value?.length}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                  {isOAuth && (
                    <FormDescription>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="link"
                            className="p-0 h-max inline hover:cursor-default"
                          >
                            Why can't I change this?
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-sm">
                            Your account does not use password authentification.
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          </div>
          <Button className="w-[100px] mb-12 block mx-auto" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SettingsSecurity;
