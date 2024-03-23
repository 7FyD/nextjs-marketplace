"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { deleteAccountSettingsSchema } from "@/schemas/settings-schemas";
import { deleteAccount } from "@/app/actions/settings";
import toast from "react-hot-toast";
import { FormError } from "@/app/components/utilities/form-error";
import { logout } from "@/app/actions/logout";
import { BeatLoader } from "react-spinners";

interface SettingsDeleteAccountInterface {
  isDesktop: boolean;
}

const SettingsDeleteAccount: React.FC<SettingsDeleteAccountInterface> = ({
  isDesktop,
}) => {
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [twoFactorError, setTwoFactorError] = useState<string>("");
  const deleteAccountForm = useForm<
    z.infer<typeof deleteAccountSettingsSchema>
  >({
    resolver: zodResolver(deleteAccountSettingsSchema),
    defaultValues: {
      code: "",
    },
  });

  const onDeleteAccountFormSubmit = (
    values: z.infer<typeof deleteAccountSettingsSchema>
  ) => {
    startTransition(() => {
      deleteAccount(values).then((data) => {
        if (data.existingTwoFactorCode) {
          setShowTwoFactor(true);
          setTwoFactorError(data.existingTwoFactorCode);
        }
        if (data.twoFactorCode) {
          setShowTwoFactor(true);
        }
        if (data?.twoFactorError) {
          setTwoFactorError(data.twoFactorError);
        }
        if (data.error) {
          setShowTwoFactor(false);
          setTwoFactorError("");
          toast.error(data.error);
        }
        if (data.success) {
          setShowTwoFactor(false);
          setTwoFactorError("");
          toast.success(data.success);
          setDialogIsOpen(false);
          logout();
        }
      });
    });
  };

  // const handleDeleteClick = () => {
  //   if (isDeleteFAHidden === true) {
  //     setIsDeleteFAHidden(false);
  //   } else {
  //   }
  // };
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  return (
    <div>
      <h2 className="mt-4 text-center font-semibold">
        Permanently delete your account
      </h2>
      <div className="mt-6 mb-24">
        <p className="mb-16 text-center mx-2">
          This is a permanent action. Please note that it cannot be undone, and
          contacting support afterwards is pointless.
        </p>
        <AlertDialog
          open={dialogIsOpen}
          onOpenChange={() => setDialogIsOpen(!dialogIsOpen)}
        >
          <Form {...deleteAccountForm}>
            <form
              id="deleteAccountForm"
              onSubmit={deleteAccountForm.handleSubmit(
                onDeleteAccountFormSubmit
              )}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="block mx-auto">
                  Delete account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <FormField
                  control={deleteAccountForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <div
                        className={`mx-4 ${showTwoFactor ? "block" : "hidden"}`}
                      >
                        <p className="mb-2">
                          A confirmation code has been sent to your email.
                        </p>
                        <Label>2FA Code:</Label>
                        <FormControl>
                          <Input {...field} type="text" placeholder="123456" />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <AlertDialogFooter>
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <div className="flex flex-row sm:space-x-2">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        form="deleteAccountForm"
                        type="submit"
                        className="mt-2"
                        disabled={isPending}
                      >
                        Continue
                      </Button>
                    </div>
                    {isPending && <BeatLoader />}
                  </div>
                </AlertDialogFooter>
                <FormError message={twoFactorError} />
              </AlertDialogContent>
            </form>
          </Form>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SettingsDeleteAccount;
