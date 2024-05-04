"use client";

import qs from "query-string";
import { Check, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { countriesArray } from "@/data/const-data";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
const SearchBar = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const params = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [buttonLabel, setButtonLabel] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const onSubmit = useCallback(async () => {
    startTransition(() => {
      let currentQuery = {};

      if (params) {
        currentQuery = qs.parse(params.toString());
      }
      const updatedQuery: any = {
        ...currentQuery,
        input: inputValue,
        country: countryFilter,
      };

      const url = qs.stringifyUrl(
        {
          url: currentPath,
          query: updatedQuery,
        },
        { skipNull: true, skipEmptyString: true }
      );

      router.push(url);
    });
  }, [countryFilter, inputValue, countryFilter, params]);

  return (
    <div className="flex flex-col lg:!flex-row items-center justify-center mt-12 mx-auto w-full md:w-1/2">
      <div className="w-3/5 relative bg-accent border">
        <div className="absolute top-[0.85rem] left-4">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          id="searchInput"
          className="py-6 px-12 border-0 shadow-none w-full"
          placeholder="What is it you're searching for?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <div className="w-3/5 flex flex-col sm:!flex-row justify-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full sm:!w-2/5 p-6 justify-between"
            >
              {buttonLabel !== "" ? buttonLabel : "Select a country"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
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
                        setButtonLabel(country.label);
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

        <Button
          onClick={onSubmit}
          disabled={isPending}
          className="border w-full sm:!w-3/5 p-6 rounded-none bg-inherit text-accent-foreground hover:text-accent !duration-200 disabled:bg-primary/90 disabled:text-accent"
        >
          {isPending ? <BeatLoader /> : "Search"}
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
