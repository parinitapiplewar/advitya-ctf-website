"use client";

import React from "react";
import { Filter } from "lucide-react";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "web", label: "Web" },
  { value: "OSINT", label: "OSINT" },
  { value: "pwn", label: "PWN" },
  { value: "crypto", label: "Crypto" },
  { value: "forensics", label: "Forensics" },
  { value: "reverse", label: "Reverse" },
  { value: "misc", label: "Misc" },
];

const CategoryFilter = ({
  selectedCategory,
  filteredChallenges,
  challenges,
  onCategoryChange,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-semibold">
            Filter by category:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-all ${
                selectedCategory === category.value
                  ? "bg-white text-black font-semibold"
                  : "bg-white/15 text-white hover:bg-white/70 hover:text-black font-semibold"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-white/80 font-semibold text-sm">
          Showing {filteredChallenges.length} of {challenges.length} challenges
          {selectedCategory !== "all" && (
            <span className="ml-1">
              in{" "}
              {categories.find((cat) => cat.value === selectedCategory)?.label}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default CategoryFilter;
