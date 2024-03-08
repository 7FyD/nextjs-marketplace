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
import { FileUpload } from "@/app/components/utilities/file-upload";
const SettingsGeneral = () => {
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
                    <FileUpload
                      endpoint="listingImage"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Add an image to better advertise your product!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button disabled={false} type="submit" className="w-full">
            Change name
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

export default SettingsGeneral;
