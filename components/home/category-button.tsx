"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import qs from "query-string";

interface CategoryButtonInterface {
  label: string;
  href: string;
  children: React.ReactNode;
  className?: string;
}

const CategoryButton: React.FC<CategoryButtonInterface> = ({
  label,
  href,
  children,
  className,
}) => {
  const currentPath = usePathname();
  const params = useSearchParams();
  const category = params.get("category");
  const isActive = category?.toLowerCase() === href.toLowerCase();
  const router = useRouter();
  const onClick = useCallback(async () => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    const updatedQuery: any = {
      ...currentQuery,
      category: href,
    };
    const url = qs.stringifyUrl(
      {
        url: currentPath,
        query: updatedQuery,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [params]);

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center border-2 rounded-full transition active:scale-125 hover:scale-[1.20] hover:cursor-pointer size-[120px] lg:size-[130px] ${className} ${
        isActive ? "scale-125" : ""
      }`}
    >
      {children}
      <p>{label}</p>
    </button>
  );
};

export default CategoryButton;
