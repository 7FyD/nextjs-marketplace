"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/app/actions/delete-user-admin";
import { useForm } from "react-hook-form";
import { NewPasswordSchema } from "@/schemas/user-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { Button } from "../ui/button";
import { Ban } from "lucide-react";

interface DeleteUserProps {
  id: string;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ id }) => {
  const router = useRouter();
  const deleteAccountForm = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const deleteUserAction = (values: z.infer<typeof NewPasswordSchema>) => {
    deleteUser(id, values).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        router.push("/");
      }
    });
  };

  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  return (
    <AlertDialog
      open={dialogIsOpen}
      onOpenChange={() => setDialogIsOpen(!dialogIsOpen)}
    >
      <Form {...deleteAccountForm}>
        <form
          id="deleteAccountForm"
          onSubmit={deleteAccountForm.handleSubmit(deleteUserAction)}
        >
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              className="w-[150px] bg-red-800 hover:bg-red-950"
            >
              Delete user <Ban className="ml-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Please input your password to confirm your admin identity.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <FormField
              control={deleteAccountForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <Label>Password</Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        id="password"
                        placeholder="********"
                        autoComplete="password"
                        displayShowPassword={!!field.value.length}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button form="deleteAccountForm" type="submit">
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      </Form>
    </AlertDialog>
  );
};
export default DeleteUser;
