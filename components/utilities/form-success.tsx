import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
  message?: string;
  className?: string;
}

export const FormSuccess = ({ message, className }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div
      className={`bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500 ${className}`}
    >
      <CheckCircledIcon className="size-4 min-w-4 min-h-4" />
      <p>{message}</p>
    </div>
  );
};
