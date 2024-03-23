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
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { FileUploadButton } from "@/app/components/utilities/file-upload-button";
import { format } from "date-fns";
import { Info } from "lucide-react";
import Image from "next/image";
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
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

interface SettingsGeneralInterface {
  user: User | null;
  isDesktop: boolean;
}

const SettingsGeneral: React.FC<SettingsGeneralInterface> = ({
  user,
  isDesktop,
}) => {
  const [isPending, startTransition] = useTransition();
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

  const onGeneralFormSubmit = (
    values: z.infer<typeof generalSettingsSchema>
  ) => {
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
  };
  return (
    <div>
      <h2 className="mt-4 text-center font-semibold px-6">General info</h2>
      <Form {...generalForm}>
        <form onSubmit={generalForm.handleSubmit(onGeneralFormSubmit)}>
          <FormField
            control={generalForm.control}
            name="image"
            render={({ field }) => (
              <FormItem className="ml-auto">
                <div
                  className={`mt-4 gap-8 p-6 mb-16 grid ${
                    isDesktop ? "ml-14 mr-14 grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  <div className="mx-auto ">
                    <Label>User avatar: </Label>
                    <Image
                      className="rounded-full h-[96px] w-[96px] max-w-[96px] max-h-[96px] mt-3 object-cover"
                      src={field.value ? field.value : "/public/public.png"}
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
                          This email is displayed on every listing that you post
                          as a method of contact.
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
                <FormItem className={`mb-12 ${!isDesktop && "mx-auto"}`}>
                  <div>
                    <Label className="h-min block">Date of birth</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="inline-block" variant="outline">
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
                            ? `Curent birthday: ${format(field.value, "P")}`
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
                <FormItem className="mb-12 mx-auto">
                  <div>
                    <Label className="h-min">Allow people to follow you</Label>
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
          <div className="flex flex-col justify-center items-center mb-8">
            <Button
              className="w-[100px] mb-4 block mx-auto"
              type="submit"
              disabled={isPending}
            >
              Submit
            </Button>
            {isPending && <BeatLoader />}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SettingsGeneral;
