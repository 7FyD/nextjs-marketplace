"use client";

import { followUser } from "@/app/actions/follow-user";
import ListingsDisplay from "@/app/components/listings/listings-display";
import { Button } from "@/app/components/ui/button";
import Container from "@/app/components/utilities/Container";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { Listing, User } from "@prisma/client";
import {
  Ban,
  MessageSquareWarning,
  UserMinusIcon,
  UserPlusIcon,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

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
import ReportModal from "@/app/components/user-profile/report-modal";
import FollowersDialog from "@/app/components/user-profile/followers-dialog";
import { deleteUser } from "@/app/actions/delete-user-admin";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { NewPasswordSchema } from "@/schemas/user-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
interface UserProfileClientInterface {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
    allowFollow: boolean | null;
    role: "USER" | "ADMIN";
    followers: User[];
    followings: User[];
  };
  userListings: Listing[];
  totalListingsCount: number;
  listingsPerPage: number;
}

const UserProfileClient: React.FC<UserProfileClientInterface> = ({
  user,
  userListings,
  totalListingsCount,
  listingsPerPage,
}) => {
  const router = useRouter();
  const [isFollowPending, startFollowTransition] = useTransition();
  const [followers, setFollowers] = useState<number>(user.followers.length);
  const following = user.followings.length;
  const currentUser = useCurrentUser();
  const [isFollowed, setIsFollowed] = useState<boolean>(
    currentUser
      ? user.followers.some((follower) => follower.id === currentUser.id)
      : false
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const followAction = () => {
    startFollowTransition(() => {
      followUser(user.id)
        .then((data) => {
          const operation = data.operation;

          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            if (operation === "added") setFollowers(followers + 1);
            else setFollowers(followers - 1);
            toast.custom(
              (t) => (
                <div
                  className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-4 shadow-lg w-80 ${
                    t.visible ? "animate-enter" : "animate-leave"
                  }`}
                >
                  <div className="flex items-center gap-10">
                    {operation === "added" ? (
                      <UserPlusIcon size={24} className="text-green-500 mr-2" />
                    ) : (
                      <UserMinusIcon size={24} className="text-red-500 mr-2" />
                    )}
                    <div className="w-40">
                      <p className="text-lg font-medium text-center">
                        Success!
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-center">
                        {data.success}
                      </p>
                    </div>
                  </div>
                </div>
              ),
              {
                duration: 2500,
              }
            );
            setIsFollowed(!isFollowed);
          }
        })
        .catch(() => toast.error("Something went wrong."));
    });
  };

  const deleteAccountForm = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const deleteUserAction = (values: z.infer<typeof NewPasswordSchema>) => {
    deleteUser(user.id, values).then((data) => {
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
    <Container>
      <div
        className={`flex ${
          isDesktop ? "flex-row gap-0" : "flex-col gap-10"
        } items-center mt-16 p-6 border-2 rounded-full bg-gray-200 `}
      >
        <Image
          className="rounded-full"
          src={user.image ? user.image : "/images/default.png"}
          width={256}
          height={256}
          alt={`${user.name} image`}
        />
        <div className="flex flex-col justify-between items-center gap-2 mx-auto">
          <h1 className="font-semibold text-xl">{user.name}</h1>
          <p>Email: {user.email}</p>
          <FollowersDialog
            label="followers"
            message="All followers are public"
            followCount={followers}
            displayName={user.name}
            userList={user.followers}
          />
          <FollowersDialog
            label="following"
            message="All the people you follow are public"
            followCount={following}
            displayName={user.name}
            userList={user.followings}
          />
          <p>Role: {user.role}</p>
          {user.id !== currentUser?.id && (
            <div
              className={`flex ${
                isDesktop ? "flex-row" : "flex-col"
              } gap-4 mt-8`}
            >
              {user.allowFollow && (
                <Button
                  disabled={isFollowPending}
                  type="button"
                  onClick={followAction}
                  className={`w-[150px] mb-2 ${
                    !isFollowed &&
                    "bg-white border-[1px] text-black border-black hover:bg-slate-100"
                  }`}
                >
                  {isFollowed ? (
                    <>
                      Unfollow <UserMinusIcon className="ml-3" />
                    </>
                  ) : (
                    <>
                      Follow <UserPlusIcon className="ml-3" />
                    </>
                  )}
                </Button>
              )}
              <ReportModal userId={user.id} name={user.name} />
              {user.role !== "ADMIN" && currentUser?.role === "ADMIN" && (
                <AlertDialog
                  open={dialogIsOpen}
                  onOpenChange={() => setDialogIsOpen(!dialogIsOpen)}
                >
                  <Form {...deleteAccountForm}>
                    <form
                      id="deleteAccountForm"
                      onSubmit={deleteAccountForm.handleSubmit(
                        deleteUserAction
                      )}
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
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Please input your password to confirm your admin
                            identity.
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
              )}
            </div>
          )}
        </div>
      </div>
      {userListings.length > 0 && (
        <>
          <h1 className="text-center font-semibold text-xl mt-6">
            User listings:{" "}
          </h1>
          <ListingsDisplay
            listings={userListings}
            totalListingsCount={totalListingsCount}
            listingsPerPage={listingsPerPage}
            defaultHidden={true}
          />
        </>
      )}
    </Container>
  );
};

export default UserProfileClient;
