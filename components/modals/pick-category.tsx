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
} from "@/components/ui/dialog";
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
    if (category !== "Digital Goods") {
      setSelectedCategory(category);
      onSelectCategory(category);
    } else {
      setSelectedCategory("Digitalgoods");
      onSelectCategory("Digitalgoods");
    }
  };

  return (
    <Dialog key={key}>
      <DialogTrigger asChild className={`block ${className}`}>
        <Button variant="outline">
          {selectedCategory === ""
            ? "Select a category"
            : selectedCategory === "Digitalgoods"
            ? `Digital Goods - change`
            : `${selectedCategory} - change`}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`overflow-hidden max-h-[80%] max-w-max p-8 bg-white text-black`}
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Pick your item's category
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            What will it be?
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full h-full justify-center">
          <PickCategoryButton
            label="Software"
            handleClick={handleCategorySelect}
          />
          <PickCategoryButton
            label="Smartphones"
            handleClick={handleCategorySelect}
          />
          <PickCategoryButton
            label="Hardware"
            handleClick={handleCategorySelect}
          />
          <PickCategoryButton
            label="Clothing"
            handleClick={handleCategorySelect}
          />
          <PickCategoryButton label="Art" handleClick={handleCategorySelect} />
          <PickCategoryButton
            className="mx-auto"
            label="Housing"
            handleClick={handleCategorySelect}
          />
          <PickCategoryButton
            className="mx-auto"
            label="Digital Goods"
            handleClick={handleCategorySelect}
          />
          <PickCategoryButton
            className="mx-auto"
            label="Cars"
            handleClick={handleCategorySelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PickCategoryModal;
