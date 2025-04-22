
import React from "react";
import { Button } from "@/components/ui/button-component";
import { Search, Filter } from "lucide-react";

interface ExercisePickerSearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterType: string | null;
  toggleFilterType: (type: string) => void;
}

const ExercisePickerSearch: React.FC<ExercisePickerSearchProps> = ({
  searchQuery,
  setSearchQuery,
  filterType,
  toggleFilterType,
}) => (
  <div className="p-2 mb-2">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
      <input
        type="text"
        placeholder="Search exercises..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-[#2F2F2F] border border-[#3A3A3A] rounded-md py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#F97316]"
      />
    </div>
    <div className="flex gap-2 mt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleFilterType("compound")}
        className={`text-xs border-[#454545] ${
          filterType === "compound"
            ? "bg-blue-600 text-white border-blue-700"
            : "hover:bg-[#353535]"
        }`}
      >
        <Filter className="w-3 h-3 mr-1" />
        Compound
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleFilterType("isolation")}
        className={`text-xs border-[#454545] ${
          filterType === "isolation"
            ? "bg-purple-600 text-white border-purple-700"
            : "hover:bg-[#353535]"
        }`}
      >
        <Filter className="w-3 h-3 mr-1" />
        Isolation
      </Button>
    </div>
  </div>
);

export default ExercisePickerSearch;
