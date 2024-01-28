"use client";
import { logout } from "@/app/actions/logout";

import { Button } from "@/app/components/ui/button";

const SignOut = () => {
  const signOut = () => {
    logout();
  };

  return (
    <Button className="w-max" onClick={signOut}>
      Log out
    </Button>
  );
};

export default SignOut;
