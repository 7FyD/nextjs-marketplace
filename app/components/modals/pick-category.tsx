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
        className={`overflow-hidden  max-h-[80%] sm:max-w-2xl p-8 bg-white text-black`}
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Pick your item's category
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            What will it be?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-12 w-full h-full justify-center">
          <div className="flex flex-row justify-between gap-12">
            <PickCategoryButton
              label="Software 👨‍💻"
              handleClick={handleCategorySelect}
            />
            <PickCategoryButton
              label="Smartphones 📱"
              handleClick={handleCategorySelect}
            />
          </div>
          <div className="flex flex-row justify-between gap-12">
            <PickCategoryButton
              label="Hardware 🖥"
              handleClick={handleCategorySelect}
            />
            <PickCategoryButton
              label="Digital goods 💻"
              handleClick={handleCategorySelect}
            />
          </div>
          <div className="flex flex-row justify-between gap-12">
            <PickCategoryButton
              label="Clothing 🧥"
              handleClick={handleCategorySelect}
            />
            <PickCategoryButton
              label="Art 🎨"
              handleClick={handleCategorySelect}
            />
          </div>
          <PickCategoryButton
            className="mx-auto"
            label="Housing 🏡"
            handleClick={handleCategorySelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PickCategoryModal;
