"use client";

import * as z from "zod";

import { Button } from "@/app/components/ui/button";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { MessageSquareWarning } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { sendReport } from "@/app/actions/send-report";
import toast from "react-hot-toast";
import { ReportFormSchema } from "@/schemas/user-schemas";
interface ReportModalInterface {
  userId: string;
  name: string | null;
}

const ReportModal: React.FC<ReportModalInterface> = ({ userId, name }) => {
  const [isPending, startTransition] = useTransition();
  const reportForm = useForm<z.infer<typeof ReportFormSchema>>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      userId: userId,
    },
  });

  const onSubmit = (values: z.infer<typeof ReportFormSchema>) => {
    startTransition(() => {
      sendReport(values).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="w-[150px] bg-red-500 hover:bg-red-700">
          Report <MessageSquareWarning className="ml-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report {name}</DialogTitle>
          <DialogDescription>
            Why are you reporting this account?
          </DialogDescription>
        </DialogHeader>
        <Form {...reportForm}>
          <form
            onSubmit={reportForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={reportForm.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="name" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          This user's name is offensive/harmful
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="photo" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          This user's profile picture is offensive/harmful
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="listing" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          This user has posted offensive listings
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="impersonation" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          This user is pretending to be someone he isn't
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="scam" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          This user is conducting scam/unlawful operations
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit">
              Send report
            </Button>
          </form>
        </Form>
        <DialogFooter className="font-light text-center">
          We treat every report seriously. Abusive reports will be punished.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
