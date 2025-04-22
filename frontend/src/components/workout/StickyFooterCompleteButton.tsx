
import { Button } from "@/components/ui/button-component";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card-container";

interface StickyFooterCompleteButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const StickyFooterCompleteButton = ({ onClick, disabled }: StickyFooterCompleteButtonProps) => (
  <Card className="mt-6 bg-[#2F2F2F] border-[#454545] sticky bottom-4">
    <CardContent className="pt-6">
      <Button 
        className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
      >
        <CheckCircle2 className="h-5 w-5 mr-2" />
        Complete Workout
      </Button>
    </CardContent>
  </Card>
);

export default StickyFooterCompleteButton;
