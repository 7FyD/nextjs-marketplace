"use client";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Dialog,
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

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { FileUploadButton } from "@/app/components/utilities/file-upload-button";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { format } from "date-fns";
import { Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import SettingsNavigation from "./settings-navigation";

// import { CardWrapper } from "@/app/components/auth/card-wrapper";
// import { Input } from "@/app/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/app/components/ui/form";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { SettingsGeneralSchema } from "@/schemas/user-schemas";
// import { useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { settingsGeneral } from "@/app/actions/settings";
// import { Button } from "@/app/components/ui/button";
// import { FormError } from "@/app/components/utilities/form-error";
// import { FormSuccess } from "@/app/components/utilities/form-success";
// import { BeatLoader } from "react-spinners";
// import { FileUploadButton } from "@/app/components/utilities/file-upload-button";
// import { useCurrentUser } from "@/app/hooks/use-current-user";
// import Image from "next/image";
// const SettingsGeneral = () => {
//   const user = useCurrentUser();
//   const [imageSrc, setImageSrc] = useState<string | null | undefined>(
//     user?.image
//   );
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, startTransition] = useTransition();
//   const generalSettingsForm = useForm<z.infer<typeof SettingsGeneralSchema>>({
//     resolver: zodResolver(SettingsGeneralSchema),
//     defaultValues: {
//       name: "",
//     },
//   });
//   const onNewNameSubmit = (values: z.infer<typeof SettingsGeneralSchema>) => {
//     startTransition(() => {
//       settingsGeneral(values)
//         .then((data) => {
//           if (data?.error) {
//             console.log(data.error);
//             setError(data.error);
//           }

//           if (data?.success) {
//             setSuccess(data.success);
//           }
//         })
//         .catch(() => setError("Something went wrong"));
//     });
//   };
//   return (
//     <div className="flex flex-col justify-center items-center">
//       <Image
//         className="max-w-[128px] max-h-[128px]"
//         src={imageSrc ? imageSrc : "/images/default"}
//         width={128}
//         height={128}
//         alt="User image"
//       />
//       <CardWrapper
//         className="flex flex-col mx-auto"
//         headerTitle="Basic information"
//         headerLabel="Data that is publicly displayed to everyone"
//       >
//         <Form {...generalSettingsForm}>
//           <form
//             onSubmit={generalSettingsForm.handleSubmit(onNewNameSubmit)}
//             className="space-y-6"
//           >
//             <div className="space-y-4">
//               <FormField
//                 control={generalSettingsForm.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>New name</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={false}
//                         placeholder="Harvey Specter"
//                         type="text"
//                         id="name"
//                         autoComplete="name"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={generalSettingsForm.control}
//                 name="imageUrl"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Image</FormLabel>
//                     <FormControl>
//                       <FileUploadButton
//                         endpoint="listingImage"
//                         value={field.value}
//                         onChange={(e) => {
//                           field.onChange;
//                           setImageSrc(e);
//                         }}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <FormSuccess message={success} />
//             <FormError message={error} />
//             <Button disabled={false} type="submit" className="w-full">
//               Submit changes
//             </Button>
//             {isPending && (
//               <div className="flex flex-col justify-center items-center gap-6 mt-6">
//                 <BeatLoader />
//                 <p className="font-extralight">Loading... </p>
//               </div>
//             )}
//           </form>
//         </Form>
//       </CardWrapper>
//     </div>
//   );
// };

// export default SettingsGeneral;

const SettingsClient = () => {
  const user = useCurrentUser();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const query = useSearchParams().get("type");
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(
    user?.image ? user?.image : ""
  );
  const [date, setDate] = useState<Date | undefined>(new Date());

  if (query !== null && query !== "security" && query !== "general")
    return <div>muie</div>;

  return (
    <div className="border bg-card text-card-foreground shadow w-3/4 md:w-1/2 mx-auto mt-24 rounded-sm">
      <div className={`flex ${isDesktop ? "flex-row" : "flex-col"}`}>
        <SettingsNavigation
          isDesktop={isDesktop}
          pathname={pathname}
          currentRoute={query}
        />
        <div className="flex flex-col mx-auto mt-4">
          {(query === null || query === "general") && (
            <>
              <h2 className="mt-4 font-semibold px-6">General info</h2>
              <div className="grid grid-cols-2 mt-4 gap-8 p-6">
                <div>
                  <Label>User avatar: </Label>
                  <Image
                    className="rounded-full max-w-[96px] max-h-[96px] mt-3"
                    src={avatarSrc ? avatarSrc : ""}
                    width={96}
                    height={96}
                    alt={`${user?.name}'s image`}
                  />
                </div>
                <FileUploadButton
                  className="mt-14"
                  endpoint="listingImage"
                  value={avatarSrc}
                  onChange={(e) => {
                    setAvatarSrc(e);
                  }}
                />
                <div>
                  <Label className="h-min">First name</Label>
                  <Input />
                </div>
                <div className="mb-12">
                  <Label className="h-min">Last name</Label>
                  <Input />
                </div>
                <div className="mb-12">
                  <Label className="h-min">Phone number</Label>
                  <Input />
                </div>
                <div className="mb-12">
                  <Label className="h-min">Public email</Label>{" "}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Info className="inline w-[18px] h-[18px]" />
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
                  <Input />
                </div>
                <div className="mb-12">
                  <Label className="h-min block">Date of birth</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="inline-block" variant="outline">
                        Change birthday
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-min flex flex-col justify-center items-center">
                      <DialogHeader>
                        <DialogTitle>Set birthday</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        Current birthday: {date ? format(date, "P") : ""}
                      </DialogDescription>
                      <Calendar
                        className="rounded-md border shadow mx-28 my-6"
                        mode="single"
                        captionLayout="dropdown"
                        fromYear={1950}
                        toYear={2016}
                        selected={date}
                        onSelect={setDate}
                      />
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="mb-12">
                  <Label className="h-min block">
                    Allow people to follow you
                  </Label>
                  <Switch className="mt-3 ml-16" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsClient;
