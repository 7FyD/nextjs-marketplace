"use client";

import { CardWrapper } from "@/app/components/auth/card-wrapper";
import { Input } from "@/app/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsGeneralSchema } from "@/schemas/user-schemas";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { settingsGeneral } from "@/app/actions/settings";
import { Button } from "@/app/components/ui/button";
import { FormError } from "@/app/components/utilities/form-error";
import { FormSuccess } from "@/app/components/utilities/form-success";
import { BeatLoader } from "react-spinners";
import { FileUploadButton } from "@/app/components/utilities/file-upload-button";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import Image from "next/image";
const SettingsGeneral = () => {
  const user = useCurrentUser();
  const [imageSrc, setImageSrc] = useState<string | null | undefined>(
    user?.image
  );
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const generalSettingsForm = useForm<z.infer<typeof SettingsGeneralSchema>>({
    resolver: zodResolver(SettingsGeneralSchema),
    defaultValues: {
      name: "",
    },
  });
  const onNewNameSubmit = (values: z.infer<typeof SettingsGeneralSchema>) => {
    startTransition(() => {
      settingsGeneral(values)
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
    <div className="flex flex-col justify-center items-center">
      <Image
        className="max-w-[128px] max-h-[128px]"
        src={imageSrc ? imageSrc : "/images/default"}
        width={128}
        height={128}
        alt="User image"
      />
      <CardWrapper
        className="flex flex-col mx-auto"
        headerTitle="Basic information"
        headerLabel="Data that is publicly displayed to everyone"
      >
        <Form {...generalSettingsForm}>
          <form
            onSubmit={generalSettingsForm.handleSubmit(onNewNameSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={generalSettingsForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={false}
                        placeholder="Harvey Specter"
                        type="text"
                        id="name"
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={generalSettingsForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <FileUploadButton
                        endpoint="listingImage"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange;
                          setImageSrc(e);
                        }}
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
              Submit changes
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
    </div>
  );
};

export default SettingsGeneral;
