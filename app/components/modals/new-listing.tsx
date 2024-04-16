"use client";
import { US, EU, GB, CH, RO } from "country-flag-icons/react/3x2";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/app/components/ui/command";

import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { FormError } from "@/app/components/utilities/form-error";
import { FormSuccess } from "@/app/components/utilities/form-success";
import { BeatLoader } from "react-spinners";
import { FileUploadDropzone } from "@/app/components/utilities/file-upload-dropzone";
import { useModal } from "@/app/hooks/use-modal-store";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { createNewListing } from "@/app/actions/new-listing";
import PickCategoryModal from "./pick-category";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

import { countriesArray } from "@/data/const-data";
import { Condition } from "@/data/const-data";
import { CountryEnum } from "@/data/const-data";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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
      details: "",
      optionalDetails: "",
      price: 0,
      imageUrl: "",
      email: user?.email ? user.email : "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewListingSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      createNewListing(values)
        .then((data) => {
          if (data?.error) {
            console.log(data.error);
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
  const [open, setOpen] = useState(false);
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
              <div className="flex flex-row justify-between">
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
                          placeholder="0.00"
                        id="price"
                        type="number"
                      />
                    </FormControl>
                      <FormDescription>
                        {form.watch("currency")
                          ? `The price is set in ${form.watch("currency")}.`
                          : "You haven't selected a currency yet."}
                      </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select your preferred currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">
                            <div className="flex flex-row gap-3 items-center w-[200px] mr-2">
                              <US
                                className="block"
                                title="USD"
                                width="24px"
                                height="24px"
                              />
                              United States Dollar ($)
                            </div>
                          </SelectItem>
                          <SelectItem value="EUR">
                            <div className="flex flex-row gap-3 items-center w-[200px] mr-2">
                              <EU
                                className="block"
                                title="EUR"
                                width="24px"
                                height="24px"
                              />
                              Euro (€)
                            </div>
                          </SelectItem>
                          <SelectItem value="GBP">
                            <div className="flex flex-row gap-3 items-center w-[200px] mr-2">
                              <GB
                                className="block"
                                title="GBP"
                                width="24px"
                                height="24px"
                              />
                              British Pound (£)
                            </div>
                          </SelectItem>
                          <SelectItem value="CHF">
                            <div className="flex flex-row gap-3 items-center w-[200px] mr-2">
                              <CH
                                className="block"
                                title="CHF"
                                width="24px"
                                height="24px"
                              />
                              Swiss Franc (₣)
                            </div>
                          </SelectItem>
                          <SelectItem value="RON">
                            <div className="flex flex-row gap-3 items-center w-[200px] mr-2">
                              <RO
                                className="block"
                                title="RON"
                                width="24px"
                                height="24px"
                              />
                              Romanian Leu (L)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <PickCategoryModal
                        onSelectCategory={(category) => {
                          field.onChange(category);
                          form.resetField("details");
                        }}
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
                      <FileUploadDropzone
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
              {form.watch("category") === "Software" && (
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Software services provided</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the software services that you are providing" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Websites">Websites</SelectItem>
                          <SelectItem value="Web applications">
                            Web applications
                          </SelectItem>
                          <SelectItem value="Desktop applications">
                            Desktop applications
                          </SelectItem>
                          <SelectItem value="Hosting services">
                            Hosting services
                          </SelectItem>
                          <SelectItem value="Other services">
                            Other services
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch("category") === "Smartphones" && (
                <FormField
                  control={form.control}
                  name="details"
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
                          <SelectItem value={Condition.NEW}>New</SelectItem>
                          <SelectItem value={Condition.EXCELLENT}>
                            Excellent
                          </SelectItem>
                          <SelectItem value={Condition.GOOD}>Good</SelectItem>
                          <SelectItem value={Condition.USED}>Used</SelectItem>
                          <SelectItem value={Condition.Broken}>
                            Broken
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch("category") === "Hardware" && (
                <>
                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hardware item</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the hardware item category that you are selling" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Periferics">
                              Periferics
                            </SelectItem>
                            <SelectItem value="PC Components">
                              PC Components
                            </SelectItem>
                            <SelectItem value="Whole PC systems">
                              Whole PC systems
                            </SelectItem>
                            <SelectItem value="Laptop">Laptop</SelectItem>
                            <SelectItem value="Other hardware">
                              Other hardware
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="optionalDetails"
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
                            <SelectItem value={Condition.NEW}>New</SelectItem>
                            <SelectItem value={Condition.EXCELLENT}>
                              Excellent
                            </SelectItem>
                            <SelectItem value={Condition.GOOD}>Good</SelectItem>
                            <SelectItem value={Condition.USED}>Used</SelectItem>
                            <SelectItem value={Condition.Broken}>
                              Broken
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {form.watch("category") === "Digital goods" && (
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Digital goods</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="What digital goods are you selling?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Video games accounts">
                            Video games accounts
                          </SelectItem>
                          <SelectItem value="Social media accounts">
                            Social media accounts
                          </SelectItem>
                          <SelectItem value="Online courses">
                            Online courses
                          </SelectItem>
                          <SelectItem value="Other hardware">
                            Other goods
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch("category") === "Clothing" && (
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clothing</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="What piece of clothing are you selling?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Shirts">Shirts</SelectItem>
                          <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                          <SelectItem value="Jeans">Jeans</SelectItem>
                          <SelectItem value="Sweatpants">Sweatpants</SelectItem>
                          <SelectItem value="Hoodies">Hoodies</SelectItem>
                          <SelectItem value="Jackets">Jackets</SelectItem>
                          <SelectItem value="Other clothing items">
                            Other clothing items
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch("category") === "Art" && (
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Art style</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-7"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Digital art" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Digital art
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Physical art" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Physical art
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch("category") === "Housing" && (
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-16"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Sale" />
                            </FormControl>
                            <FormLabel className="font-normal">Sale</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Renting" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Renting
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="w-min">Country</FormLabel>
                    <Popover open={open} onOpenChange={setOpen} modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                              "min-w-[200px] w-min justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? countriesArray.find(
                                  (country) => country.value === field.value
                                )?.label
                              : "Select country"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search country..." />
                          <CommandEmpty>No country found.</CommandEmpty>
                          <ScrollArea className="h-40 overflow-auto">
                            <CommandGroup>
                              {countriesArray.map((country) => (
                                <CommandItem
                                  value={country.label}
                                  key={country.value}
                                  onSelect={() => {
                                    form.setValue(
                                      "country",
                                      CountryEnum[
                                        country.value as keyof typeof CountryEnum
                                      ]
                                    );

                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      country.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {country.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </ScrollArea>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Specify the area where you are marketing your item.
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
                      items. It is your account's{" "}
                      <Link
                        className="hover:underline text-cyan-500"
                        href="/user/settings#publicEmail"
                        target="_blank"
                        rel="noreferrer"
                      >
                        public email
                      </Link>
                      .
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full">
              Create new listing!
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
