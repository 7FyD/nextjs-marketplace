"use client";
import { logout } from "@/app/actions/logout";
import { redirect } from "next/navigation";
import { useEffect } from "react";
const SignOutClient = () => {
  useEffect(() => {
    logout();
  });
  return <div>Signing out...</div>;
};

export default SignOutClient;
