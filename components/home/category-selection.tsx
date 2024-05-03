"use client";

import CategoryButton from "./category-button";
import {
  Building2,
  Car,
  Computer,
  Cpu,
  Instagram,
  PaintbrushIcon,
  Shirt,
  Smartphone,
} from "lucide-react";

const CategorySelection = () => {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-6 mt-12 lg:mx-24 space-y-6 md:space-y-0 md:gap-6 place-items-center md:place-items-end">
        <CategoryButton label="Software" href="Software">
          <Cpu width={48} height={48} />
        </CategoryButton>
        <CategoryButton
          className="!mt-2"
          label="Smartphones"
          href="Smartphones"
        >
          <Smartphone width={48} height={48} />
        </CategoryButton>
        <CategoryButton label="Hardware" href="Hardware">
          <Computer width={48} height={48} />
        </CategoryButton>
        <CategoryButton label="Clothing" href="Clothing">
          <Shirt width={48} height={48} />
        </CategoryButton>
        <CategoryButton label="Art" href="Art">
          <PaintbrushIcon width={48} height={48} />
        </CategoryButton>
        <CategoryButton label="Housing" href="Housing">
          <Building2 width={48} height={48} />
        </CategoryButton>
        <CategoryButton className="md:col-span-3" label="Cars" href="Cars">
          <Car width={48} height={48} />
        </CategoryButton>
        <CategoryButton label="Digital Goods" href="DigitalGoods">
          <Instagram width={48} height={48} />
        </CategoryButton>
      </div>
    </div>
  );
};

export default CategorySelection;
