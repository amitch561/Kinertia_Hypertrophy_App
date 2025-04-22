
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface AlertMessageProps {
  message: string;
  variant?: "default" | "warning";
}

const AlertMessage = ({ message, variant = "default" }: AlertMessageProps) => {
  const getAlertStyles = () => {
    switch (variant) {
      case "warning":
        return "bg-[#3F3F3F] border-[#E65A00]";
      default:
        return "bg-[#3F3F3F] border-[#454545]";
    }
  };

  return (
    <Alert className={`${getAlertStyles()} border-dashed mt-2`}>
      <Info className="h-4 w-4 text-gray-400" />
      <AlertDescription className="text-gray-300">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default AlertMessage;
