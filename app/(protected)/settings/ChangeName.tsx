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
import { SettingsChangeNameSchema } from "@/schemas";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { settingsChangeName } from "@/app/actions/settings";
import { Button } from "@/app/components/ui/button";
import { FormError } from "@/app/components/utilities/form-error";
import { FormSuccess } from "@/app/components/utilities/form-success";
const ChangeName = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const newNameForm = useForm<z.infer<typeof SettingsChangeNameSchema>>({
    resolver: zodResolver(SettingsChangeNameSchema),
    defaultValues: {
      name: "",
    },
  });
  const onNewNameSubmit = (
    values: z.infer<typeof SettingsChangeNameSchema>
  ) => {
    startTransition(() => {
      settingsChangeName(values)
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
    <CardWrapper headerTitle="" headerLabel="Change your name">
      <Form {...newNameForm}>
        <form
          onSubmit={newNameForm.handleSubmit(onNewNameSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={newNameForm.control}
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
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button disabled={false} type="submit" className="w-full">
            Change name
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ChangeName;
