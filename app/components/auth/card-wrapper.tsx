"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";
import { Header } from "@/app/components/auth/header";
import { BackButton } from "@/app/components/auth/back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  headerTitle: string;
  backButtonLabel: string;
  backButtonHref: string;
}

export const CardWrapper = ({
  children,
  headerLabel,
  headerTitle,
  backButtonLabel,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <Card className="w-[300px] md:w-[400px] shadow-md mx-auto my-16">
      <CardHeader>
        <Header label={headerLabel} title={headerTitle} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
