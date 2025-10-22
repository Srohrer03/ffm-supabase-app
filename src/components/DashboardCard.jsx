import React from "react";
import { Star } from "lucide-react";

export const DashboardCard = ({ title, children, onPin, isPinned, ...props }) => {
  return (
    <div 
      className="bg-white p-4 rounded-2xl shadow-md transition-transform duration-300 hover:scale-105"
      {...props}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button
          onClick={onPin}
          className={`transition-colors duration-200 ${
            isPinned 
              ? 'text-yellow-500 hover:text-yellow-600' 
              : 'text-gray-400 hover:text-yellow-500'
          }`}
        >
          <Star size={18} fill={isPinned ? 'currentColor' : 'none'} />
        </button>
      </div>
      {children}
    </div>
  );
};