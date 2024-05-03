"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas/user-schemas";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/utilities/form-error";
import { FormSuccess } from "@/components/utilities/form-success";
import { register } from "@/app/actions/register";
import { BeatLoader } from "react-spinners";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";

export const RegisterClient = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
      publicEmail: "",
      phoneNumber: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        if (data?.error) {
          console.log(data.error);
          setError(data.error);
        }

        if (data?.success) {
          setSuccess(data.success);
        }
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Create an account"
      headerTitle="Join us!"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Doe"
                      id="name"
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="xNoobSlayer"
                      id="username"
                      autoComplete="username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                      id="email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                      id="password"
                      autoComplete="password"
                      displayShowPassword={!!field.value.length}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publicEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public email</FormLabel>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-max inline hover:cursor-default"
                      >
                        <Info className="inline w-[18px] h-[18px] ml-1" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <p className="text-sm">
                        This email is displayed on every listing that you post
                        as a method of contact.
                        <br /> <br />
                        It has no security relevance. If left empty, will
                        default to your security email.
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="sales@ps.com"
                      type="email"
                      id="publicEmail"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Phone Number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput
                      international
                      placeholder="Enter a phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-left">
                    Enter a phone number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="mb-12">
                  <div>
                    <Label className="h-min block">Date of birth</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="inline-block w-[175px]"
                          variant="outline"
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Select birthday"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-min flex flex-col justify-center items-center">
                        <DialogHeader>
                          <DialogTitle>Set birthday</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                          {field.value
                            ? `Curent birthday: ${format(field.value, "PPP")}`
                            : ""}
                        </DialogDescription>
                        <FormControl>
                          <Calendar
                            className="rounded-md border shadow mx-28 my-6"
                            mode="single"
                            captionLayout="dropdown"
                            fromYear={new Date().getFullYear() - 100}
                            toYear={new Date().getFullYear() - 18}
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Create an account
          </Button>{" "}
          {isPending && (
            <div className="flex flex-col justify-center items-center gap-6">
              <BeatLoader />
              <p className="font-extralight">Loading... </p>
            </div>
          )}
        </form>
      </Form>
    </CardWrapper>
  );
};
