"use client";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { securitySettingsSchema } from "@/schemas/settings-schemas";
import {
  securitySettings,
  settingsSendTwoFactorEmail,
  settingsSendVerifyEmail,
} from "@/app/actions/settings";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormError } from "@/components/utilities/form-error";
import { Info } from "lucide-react";

interface SettingsSecurityInterface {
  user: User | null;
  isDesktop: boolean;
}

const SettingsSecurity: React.FC<SettingsSecurityInterface> = ({
  user,
  isDesktop,
}) => {
  const isOAuth = user?.isOAuth ? true : false;

  const [isTwoFactorPending, startTwoFactorTransition] = useTransition();
  const [isEmailConfirmedPending, startEmailConfirmedTransition] =
    useTransition();
  const [isFormPending, startFormTransition] = useTransition();

  const [twoFactorOpen, setTwoFactorOpen] = useState<boolean>(false);
  const [twoFactorError, setTwoFactorError] = useState<string>("");

  const [twoFactorButton, setTwoFactorButton] = useState<string>(
    user?.isTwoFactorEnabled ? "Disable 2FA" : "Enable 2FA"
  );
  const [twoFactorEmailSent, setTwoFactorEmailSent] = useState<boolean>(false);
  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      email: user?.email || "",
      password: "",
      code: "",
    },
  });

  const onDialogChange = () => {
    setTwoFactorOpen(!twoFactorOpen);
    securityForm.resetField("code");
  };

  const onSecurityFormSubmit = (
    values: z.infer<typeof securitySettingsSchema>
  ) => {
    setTwoFactorError("");
    startFormTransition(() => {
      if (twoFactorOpen === true && !values.code)
        setTwoFactorError("Please input a valid 2FA code.");
      else {
        securitySettings(values).then((data) => {
          if (data?.twoFactorCode) {
            setTwoFactorOpen(true);
          }
          if (data?.twoFactorError) {
            setTwoFactorError(data.twoFactorError);
          }
          if (data.error) {
            setTwoFactorOpen(false);
            setTwoFactorError("");
            toast.error(data.error);
          }
          if (data.success) {
            setTwoFactorOpen(false);
            setTwoFactorError("");
            toast.success(data.success);
          }
        });
      }
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
      <h2 className="mt-4 text-center font-semibold px-6">
        Security information
      </h2>
      <Form {...securityForm}>
        <form
          id="securityForm"
          onSubmit={securityForm.handleSubmit(onSecurityFormSubmit)}
        >
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
              <div className="flex flex-row gap-1 items-center justify-center">
                <p className="text-center">Two factor Authentificator</p>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-max inline hover:cursor-default"
                    >
                      <Info className="inline w-[18px] h-[18px]" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p className="text-sm">
                      Enabling this will require you to enter a code sent to
                      your email each time you sign into your account. This
                      additional step enhances your account's security and
                      safety.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
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
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button
                          type="button"
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
                    <Label className="h-min">New password</Label>
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
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button
                          type="button"
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
                  )}
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={securityForm.control}
            name="code"
            render={({ field }) => (
              <>
                <FormItem>
                  <Dialog open={twoFactorOpen} onOpenChange={onDialogChange}>
                    <DialogContent className="w-auto">
                      <DialogHeader>
                        <DialogTitle>Input 2FA Code</DialogTitle>
                        <DialogDescription>
                          We have sent a confirmation code to {user?.email}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col justify-center items-center gap-2">
                        <Label>Two Factor Code</Label>
                        <FormControl>
                          <Input {...field} type="text" placeholder="123456" />
                        </FormControl>
                      </div>
                      <DialogFooter className="justify-center">
                        <Button type="submit" form="securityForm">
                          Submit code
                        </Button>
                      </DialogFooter>
                      <FormError message={twoFactorError}></FormError>
                    </DialogContent>
                  </Dialog>
                </FormItem>
              </>
            )}
          />
          <div className="flex flex-col justify-center items-center mb-8">
            <Button
              className="w-[100px] mb-4 block mx-auto"
              type="submit"
              disabled={isFormPending}
            >
              Submit
            </Button>
            {isFormPending && <BeatLoader />}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SettingsSecurity;
