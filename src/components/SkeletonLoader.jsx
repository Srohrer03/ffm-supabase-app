import React from "react";

export const SkeletonLoader = ({ height = "h-32" }) => {
  return (
    <div className={`${height} bg-gray-200 rounded-lg animate-pulse`}>
      <div className="flex flex-col space-y-2 p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  );
};