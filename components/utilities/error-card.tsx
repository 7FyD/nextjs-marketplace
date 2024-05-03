import { Header } from "../auth/header";
import { BackButton } from "../auth/back-button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

export const ErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md my-16">
      <CardHeader>
        <Header title="Yikes." label="Something went wrong." />
      </CardHeader>
      <CardFooter>
        <BackButton label="Back to Login" href="/auth/login" />
      </CardFooter>
    </Card>
  );
};
