"use client";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const onClick = () => {
    console.log("LOGIN CLICKED");
  };

  return <span onClick={onClick} className="cursor-pointer"></span>;
};

export default LoginButton;
