
import React from "react";
import { Button } from "@/components/ui/button-component";

interface SelectAllRecommendedButtonProps {
  onSelectAll: () => void;
}

const SelectAllRecommendedButton: React.FC<SelectAllRecommendedButtonProps> = ({
  onSelectAll
}) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onSelectAll}
    className="text-xs border-[#454545] hover:bg-[#353535]"
  >
    Select All Recommended
  </Button>
);

export default SelectAllRecommendedButton;
