"use client";
import { logout } from "@/app/actions/logout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const SignOutClient = () => {
  const router = useRouter();
  useEffect(() => {
    const waitLogout = async () => {
      await logout();
    };
    waitLogout().then(() => {
      router.push("/auth/login");
      window.location.reload();
    });
  });
  return <div>Signing out...</div>;
};

export default SignOutClient;
