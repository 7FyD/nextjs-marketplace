"use client";

import { Button } from "../ui/button";

interface ResetFiltersInterface {
  handleClick: () => void;
}

const ResetFilters: React.FC<ResetFiltersInterface> = ({ handleClick }) => {
  return (
    <Button
      className="mx-auto block w-[250px] mb-8"
      variant={"destructive"}
      onClick={handleClick}
    >
      Clear filters
    </Button>
  );
};

export default ResetFilters;
