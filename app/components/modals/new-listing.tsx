"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewListingSchema } from "@/schemas/listing-schemas";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

enum Condition {
  NONE = "None",
  NEW = "New",
  EXCELLENT = "Excellent",
  GOOD = "Good",
  USED = "Used",
  Broken = "Broken",
}

import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { FormError } from "@/app/components/utilities/form-error";
import { FormSuccess } from "@/app/components/utilities/form-success";
import { BeatLoader } from "react-spinners";
import { FileUpload } from "@/app/components/utilities/file-upload";
import { useModal } from "@/app/hooks/use-modal-store";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { createNewListing } from "@/app/actions/new-listing";
import PickCategoryModal from "./pick-category";

const NewListingModal = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const { isOpen, onClose, type } = useModal();
  // const isModalOpen = isOpen && type === "newListing";
  const user = useCurrentUser();
  const form = useForm<z.infer<typeof NewListingSchema>>({
    resolver: zodResolver(NewListingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      imageUrl: "",
      country: "",
      phone: "",
      email: user?.email ? user.email : "",
    },
  });
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (values: z.infer<typeof NewListingSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      createNewListing(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            setSuccess("");
          }

          if (data?.success) {
            setSuccess(data.success);
            setError("");
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">New Listing</Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll w-auto max-h-[80%] sm:max-w-2xl px-20 p-16 bg-white text-black">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create a new listing
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give as many details and as accurate as possible
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing title</FormLabel>
                    <FormControl>
                      <Input
                        className="sm:w-full"
                        {...field}
                        disabled={isPending}
                        placeholder="What are you selling?"
                        id="title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder="Write a little something about your item."
                        id="description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="John Doe"
                        id="price"
                        type="number"
                      />
                    </FormControl>
                    <FormDescription>The price is set in €.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <PickCategoryModal
                        onSelectCategory={(category) =>
                          field.onChange(category)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item condition</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your item's condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value={Condition.EXCELLENT}>
                          Excellent
                        </SelectItem>
                        <SelectItem value={Condition.GOOD}>Good</SelectItem>
                        <SelectItem value={Condition.USED}>Used</SelectItem>
                        <SelectItem value={Condition.Broken}>Broken</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country where you can ship your item</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder={`${user?.name} or Romania?`}
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="John Doe"
                        id="name"
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormDescription>
                      This phone number is going to be displayed as a way for
                      users to contact you.
                    </FormDescription>
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
                      <Input {...field} disabled id="email" type="email" />
                    </FormControl>
                    <FormDescription>
                      This email will be shown to the people who order your
                      items. It is linked to your account's email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full">
              Create an account
            </Button>
            {isPending && (
              <div className="flex flex-col justify-center items-center gap-6">
                <BeatLoader />
                <p className="font-extralight">Loading... </p>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewListingModal;