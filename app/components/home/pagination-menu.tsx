"use client";

import { useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";

interface PaginationMenuProps {
  totalPages: number;
  className?: string;
}

const PaginationMenu: React.FC<PaginationMenuProps> = ({
  totalPages,
  className,
}) => {
  const searchParams = useSearchParams();
  if (totalPages < 2) return;
  const page = Math.max(parseInt(searchParams.get("page") ?? "0"), 1);
  return (
    <Pagination className={className}>
      <PaginationContent>
        {page > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious href={`/?page=${page - 1}`} />
            </PaginationItem>
            <PaginationItem className="list-item sm:!hidden">
              <PaginationLink href={"/?page=1"}>1</PaginationLink>
            </PaginationItem>
          </>
        )}
        {page > 2 && (
          <>
            <PaginationItem className="hidden sm:!list-item">
              <PaginationLink href={"/?page=1"}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem className="block sm:!hidden">
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {page > 3 && (
          <PaginationItem className="hidden sm:!list-item">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {page > 1 && (
          <PaginationItem className="hidden sm:!list-item">
            <PaginationLink href={`/?page=${page - 1}`}>
              {page - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive href={`/?page=${page}`}>
            {page}
          </PaginationLink>
        </PaginationItem>
        {totalPages >= page + 1 && (
          <PaginationItem className="">
            <PaginationLink href={`/?page=${page + 1}`}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {totalPages - 2 > page && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href={`/?page=${totalPages}`}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        {totalPages - 2 === page && (
          <PaginationItem>
            <PaginationLink href={`/?page=${totalPages}`}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext href={`/?page=${page + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationMenu;
