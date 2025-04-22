
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch-toggle";

interface ShoulderTargetingOverrideProps {
  shoulderFocusOverride: boolean;
  onOverrideChange: (value: boolean) => void;
}

const ShoulderTargetingOverride = ({ 
  shoulderFocusOverride, 
  onOverrideChange 
}: ShoulderTargetingOverrideProps) => (
  <Alert className="bg-[#3F3F3F] border-[#454545] border mb-4">
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center">
        <InfoIcon className="h-4 w-4 text-gray-400 mr-2" />
        <AlertDescription className="text-white">
          Let me manage delt targeting manually
        </AlertDescription>
      </div>
      <Switch 
        checked={shoulderFocusOverride}
        onCheckedChange={onOverrideChange}
        className="data-[state=checked]:bg-[#E65A00]"
      />
    </div>
    {shoulderFocusOverride && (
      <AlertDescription className="text-gray-400 mt-2 ml-6">
        Manual mode enabled – You're free to emphasize any shoulder region you prefer.
      </AlertDescription>
    )}
  </Alert>
);

export default ShoulderTargetingOverride;
