
import React from "react";
import { MoreHorizontal } from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem
} from "@/components/ui/context-menu";

interface ExerciseCardMenuProps {
  onReplaceClick: () => void;
  onPainReportClick: () => void;
}

const ExerciseCardMenu: React.FC<ExerciseCardMenuProps> = ({
  onReplaceClick,
  onPainReportClick
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button className="p-1 rounded-full hover:bg-[#3A3A3A] focus:outline-none">
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-[#2A2A2A] border-[#454545] text-white">
        <ContextMenuItem 
          className="hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] cursor-pointer"
          onClick={onReplaceClick}
        >
          Replace Exercise
        </ContextMenuItem>
        <ContextMenuItem 
          className="hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] cursor-pointer"
          onClick={onPainReportClick}
        >
          Report Joint Pain
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ExerciseCardMenu;
