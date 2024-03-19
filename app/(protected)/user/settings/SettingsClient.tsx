"use client";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/app/components/ui/hover-card";
import { usePathname, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { FileUploadButton } from "@/app/components/utilities/file-upload-button";
import { format } from "date-fns";
import { Info } from "lucide-react";
import Image from "next/image";
import SettingsNavigation from "./settings-navigation";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generalSettingsSchema } from "@/schemas/settings-schemas";
import { generalSettings } from "@/app/actions/settings";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SettingsClientInterface {
  user: User | null;
}

const SettingsClient: React.FC<SettingsClientInterface> = ({ user }) => {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const query = useSearchParams().get("type");
  const [isDeleteFAHidden, setIsDeleteFAHidden] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();
  const handleDeleteClick = () => {
    if (isDeleteFAHidden === true) {
      setIsDeleteFAHidden(false);
    } else {
    }
  };

  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      image: user?.image || undefined,
      name: user?.name || undefined,
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      publicEmail: user?.publicEmail || undefined,
      dateOfBirth: user?.dateOfBirth || undefined,
      allowFollow: user?.allowFollow || false,
    },
  });

  function onGeneralFormSubmit(values: z.infer<typeof generalSettingsSchema>) {
    startTransition(() => {
      console.log(values);
      generalSettings(values)
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
          }
          if (data.error) {
            toast.error(data.error);
          }
        })
        .catch((e) => console.log(e));
    });
  }

  return (
    <div className="border bg-card text-card-foreground shadow-md w-3/4 md:w-1/2 mx-auto mt-24 rounded-sm mb-24">
      <div className={`flex ${isDesktop ? "flex-row" : "flex-col"}`}>
        <SettingsNavigation
          isDesktop={isDesktop}
          pathname={pathname}
          currentRoute={query}
        />
        <div className="flex flex-col mt-4 w-full">
          {query !== null &&
            query !== "security" &&
            query !== "general" &&
            query !== "delete account" && <div>muie</div>}
          {(query === null || query === "general") && (
            <>
              <h2 className="mt-4 text-center font-semibold px-6">
                General info
              </h2>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralFormSubmit)}>
                  <FormField
                    control={generalForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="ml-auto">
                        <div
                          className={`mt-4 gap-8 p-6 mb-16 grid ${
                            isDesktop
                              ? "ml-14 mr-14 grid-cols-2"
                              : "grid-cols-1"
                          }`}
                        >
                          <div>
                            <Label>User avatar: </Label>
                            <Image
                              className="rounded-full h-[96px] w-[96px] max-w-[96px] max-h-[96px] mt-3"
                              src={
                                field.value ? field.value : "/public/public.png"
                              }
                              width={96}
                              height={96}
                              alt={`${user?.name}'s image`}
                            />
                          </div>
                          <FormControl>
                            <FileUploadButton
                              className="mt-14"
                              endpoint="listingImage"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div
                    className={`mt-4 gap-8 p-6 mb-16 grid ${
                      isDesktop ? "ml-14 mr-14 grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    <FormField
                      control={generalForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <div>
                            <Label className="h-min">Name</Label>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="mb-12">
                          <div>
                            <Label className="h-min">Username</Label>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="mb-12">
                          <div>
                            <Label className="h-min">Phone number</Label>
                            <Input {...field} />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="publicEmail"
                      render={({ field }) => (
                        <FormItem className="mb-12">
                          <div>
                            <Label className="h-min">Public email</Label>{" "}
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button
                                  variant="link"
                                  className="p-0 h-max inline hover:cursor-default"
                                >
                                  <Info className="inline w-[18px] h-[18px]" />
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent>
                                <p className="text-sm">
                                  This email is displayed on every listing that
                                  you post as a method of contact.
                                  <br /> <br />
                                  It has no security relevance.
                                </p>
                              </HoverCardContent>
                            </HoverCard>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="mb-12">
                          <div>
                            <Label className="h-min block">Date of birth</Label>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  className="inline-block"
                                  variant="outline"
                                >
                                  {field.value
                                    ? format(field.value, "P")
                                    : "Change birthday"}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-min flex flex-col justify-center items-center">
                                <DialogHeader>
                                  <DialogTitle>Set birthday</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                  {field.value
                                    ? `Curent birthday: ${format(
                                        field.value,
                                        "P"
                                      )}`
                                    : ""}
                                </DialogDescription>
                                <FormControl>
                                  <Calendar
                                    className="rounded-md border shadow mx-28 my-6"
                                    mode="single"
                                    captionLayout="dropdown"
                                    fromYear={1950}
                                    toYear={2016}
                                    selected={field.value}
                                    onSelect={field.onChange}
                                  />
                                </FormControl>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button type="submit">Close</Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="allowFollow"
                      render={({ field }) => (
                        <FormItem className="mb-12">
                          <div>
                            <Label className="h-min">
                              Allow people to follow you
                            </Label>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-3 ml-16 block"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    className="w-[100px] mb-12 block mx-auto"
                    type="submit"
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </>
          )}
          {query === "security" && (
            <>
              <h2 className="mt-4 text-center font-semibold px-6">
                Security information
              </h2>
              <div
                className={`mt-4 gap-8 p-6 mb-16 grid ${
                  isDesktop ? "ml-14 mr-14 grid-cols-2" : "grid-cols-1"
                }`}
              >
                <div>
                  <Label className="h-min">Email</Label>
                  <Input type="email" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" />
                </div>
                <div>
                  <Label className="block">Email confirmation:</Label>
                  <Button type="button">Send confirmation</Button>
                  <p>Confirmed.</p>
                </div>
                <div>
                  <Label>Two factor Authentification</Label>
                  <Switch className="mt-3 ml-20 block" />
                </div>
              </div>
            </>
          )}
          {query === "delete account" && (
            <>
              <h2 className="mt-4 text-center font-semibold">
                Permanently delete your account
              </h2>
              <div className="mt-6 mb-24">
                <p className="ml-12 mb-16">
                  This is a permanent action. Please note that it cannot be
                  undone, and contacting support afterwards is pointless.
                </p>
                <AlertDialog
                  onOpenChange={() => {
                    setIsDeleteFAHidden(true);
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="block mx-auto">
                      Delete account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div
                      className={`mx-4 ${
                        isDeleteFAHidden ? "hidden" : "block"
                      }`}
                    >
                      <p className="mb-2">
                        A confirmation code has been sent to your email.
                      </p>
                      <Label>2FA Code:</Label>
                      <Input type="text" placeholder="123456"></Input>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button onClick={handleDeleteClick} className="mt-2">
                        Continue
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsClient;
