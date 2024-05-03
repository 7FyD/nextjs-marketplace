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
      <div className="grid grid-cols-2 md:grid-cols-4 mt-12 lg:mx-24 space-y-6 md:space-y-0 md:gap-6 items-center place-items-center">
        <CategoryButton label="Software" href="Software">
          <Cpu width={64} height={64} />
        </CategoryButton>
        <CategoryButton className="!mt-0" label="Smartphones" href="cars">
          <Smartphone width={64} height={64} />
        </CategoryButton>
        <CategoryButton label="Hardware" href="cars">
          <Computer width={64} height={64} />
        </CategoryButton>
        <CategoryButton label="Clothing" href="cars">
          <Shirt width={64} height={64} />
        </CategoryButton>
        <CategoryButton label="Art" href="cars">
          <PaintbrushIcon width={64} height={64} />
        </CategoryButton>
        <CategoryButton label="Housing" href="cars">
          <Building2 width={64} height={64} />
        </CategoryButton>
        <CategoryButton label="Cars" href="cars">
          <Car width={64} height={64} />
        </CategoryButton>
        <CategoryButton label="Digital Goods" href="Digital goods">
          <Instagram width={64} height={64} />
        </CategoryButton>
      </div>
    </div>
  );
};

export default CategorySelection;
