// PickCategoryModal.js
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "../ui/button";
import PickCategoryButton from "./pick-category-button";

interface PickCategoryModalProps {
  onSelectCategory: (category: string) => void;
  className?: string;
  key?: number;
}

const PickCategoryModal: React.FC<PickCategoryModalProps> = ({
  onSelectCategory,
  className,
  key,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  return (
    <Dialog key={key}>
      <DialogTrigger asChild className={`block ${className}`}>
        <Button variant="outline">
          {selectedCategory === ""
            ? "Select a category"
            : `${selectedCategory} - change`}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`overflow-y-scroll max-h-[80%] sm:max-w-2xl p-16 bg-white text-black`}
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Pick your item's category
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            What will it be?
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <PickCategoryButton
            label="Software"
            handleClick={handleCategorySelect}
          />
          <PickCategoryButton
            label="Smartphones"
            handleClick={handleCategorySelect}
          />
          <PickCategoryButton
            label="PC Hardware"
            handleClick={handleCategorySelect}
          />
          <PickCategoryButton
            label="PC Periferics"
            handleClick={handleCategorySelect}
          />
          <PickCategoryButton label="Etc" handleClick={handleCategorySelect} />
          <PickCategoryButton label="vad" handleClick={handleCategorySelect} />
          <PickCategoryButton label="eu" handleClick={handleCategorySelect} />
          <PickCategoryButton label="ce" handleClick={handleCategorySelect} />
          <PickCategoryButton label="mai" handleClick={handleCategorySelect} />
          <PickCategoryButton label="pun" handleClick={handleCategorySelect} />
          <PickCategoryButton label="aici" handleClick={handleCategorySelect} />
          <PickCategoryButton label="xd" handleClick={handleCategorySelect} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PickCategoryModal;
