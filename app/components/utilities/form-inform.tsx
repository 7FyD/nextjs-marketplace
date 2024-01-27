import { CiMail } from "react-icons/ci";
interface FormWarningProps {
  message?: string;
  className?: string;
}

export const FormInform = ({ message, className }: FormWarningProps) => {
  if (!message) return null;

  return (
    <div
      className={`bg-blue-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-cyan-700 ${className}`}
    >
      <CiMail className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
