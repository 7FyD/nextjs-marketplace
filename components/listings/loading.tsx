"use client";

import SkeletonCard from "./skeleton-card";
const Loading = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4 items-center">
      {"abcdefgh".split("").map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default Loading;
