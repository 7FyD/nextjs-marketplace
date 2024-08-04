"use client";

import { Button } from "../ui/button";

interface ResetFiltersInterface {
  handleClick: () => void;
}

const ResetFilters: React.FC<ResetFiltersInterface> = ({ handleClick }) => {
  return (
    <Button
      className="mx-auto block w-[250px] my-4"
      variant={"destructive"}
      onClick={handleClick}
    >
      Clear filters
    </Button>
  );
};

export default ResetFilters;
