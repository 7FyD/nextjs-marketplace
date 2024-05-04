"use client";

import qs from "query-string";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { ArrowDown, ArrowUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { countriesArray } from "@/data/const-data";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { Switch } from "../ui/switch";
import PickCategoryModal from "../modals/pick-category";

interface SearchOptionsProps {
  className?: string;
  defaultHidden?: boolean;
}

const SearchOptions: React.FC<SearchOptionsProps> = ({
  className,
  defaultHidden = true,
}) => {
  const params = useSearchParams();
  const [isHidden, setIsHidden] = useState(defaultHidden);
  const [countryFilter, setCountryFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [category, setCategory] = useState("");
  const [key, setKey] = useState(0);
  const router = useRouter();
  const currentPath = usePathname();
  const onSubmit = useCallback(async () => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    const updatedQuery: any = {
      ...currentQuery,
      country: countryFilter,
      free: isFree === true ? true : null,
      category,
    };

    const url = qs.stringifyUrl(
      {
        url: currentPath,
        query: updatedQuery,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [countryFilter, isFree, category, params]);
  const clearFilters = () => {
    setCountryFilter("");
    setIsFree(false);
    setCategory("");
    setKey(key + 1);
    router.push(currentPath);
  };
  return (
    <div
      className={`h-full top-0 left-0 w-full ${className} bg-background p-4 rounded-2xl ${
        !isHidden ? `shadow-md border-t` : ""
      }`}
    >
      <div className="flex flex-row justify-center">
        <Button onClick={() => setIsHidden(!isHidden)} className="w-[250px]">
          {isHidden ? (
            <>
              Show filters
              <ArrowDown className="ml-3" />
            </>
          ) : (
            <>
              Hide filters
              <ArrowUp className="ml-3" />
            </>
          )}
        </Button>
      </div>
      <div className={`mt-0 ${isHidden ? "hidden" : "relative"} `}>
        <div className="flex flex-col gap-12 md:gap-8 mx-12 mt-8">
          <div className="flex flex-col gap-4">
            <Label>Select country: </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {countryFilter
                    ? countriesArray.find(
                        (country) =>
                          country.value.toLowerCase() === countryFilter
                      )?.label
                    : "Select country"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search country" className="h-9" />
                  <CommandEmpty>No country found.</CommandEmpty>
                  <ScrollArea className="h-40 overflow-auto">
                    <CommandGroup>
                      {countriesArray.map((country) => (
                        <CommandItem
                          key={country.label}
                          value={country.value}
                          onSelect={(currentValue) => {
                            setCountryFilter(currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              country.value.toLowerCase() === countryFilter
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {country.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </ScrollArea>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-row items-center">
            <Label className="mr-2">Free item?</Label>
            <Switch
              checked={isFree}
              onCheckedChange={() => {
                setIsFree(!isFree);
              }}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Category:</Label>
            <PickCategoryModal
              className="mb-6 w-max"
              onSelectCategory={(category) => setCategory(category)}
            />
          </div>
        </div>
        <Button
          className="mx-auto block w-[250px] mb-8"
          variant={"secondary"}
          onClick={() => onSubmit()}
        >
          Set filters.
        </Button>
        <Button
          className="mx-auto block w-[250px] mb-8"
          variant={"destructive"}
          onClick={() => clearFilters()}
        >
          Clear filters.
        </Button>
      </div>
    </div>
  );
};

export default SearchOptions;
