import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";

interface PickCategoryButtonProps {
  handleClick: (category: string) => void;
  label: string;
  className?: string;
}

const PickCategoryButton: React.FC<PickCategoryButtonProps> = ({
  handleClick,
  label,
  className,
}) => {
  return (
    <DialogClose className={`grow w-[150px] ${className}`} asChild>
      <Button onClick={() => handleClick(`${label}`)}>
        {label.replace("_", " ")}
      </Button>
    </DialogClose>
  );
};

export default PickCategoryButton;
