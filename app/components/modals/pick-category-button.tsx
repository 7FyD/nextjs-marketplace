import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";

interface PickCategoryButtonProps {
  handleClick: (category: string) => void;
  label: string;
}

const PickCategoryButton: React.FC<PickCategoryButtonProps> = ({
  handleClick,
  label,
}) => {
  return (
    <DialogClose asChild>
      <Button onClick={() => handleClick(`${label}`)}>{label}</Button>
    </DialogClose>
  );
};

export default PickCategoryButton;
