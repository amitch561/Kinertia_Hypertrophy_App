
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const BeginnersGuideAlert = () => (
  <Alert className="bg-[#3F3F3F] border-[#E65A00] border mb-4">
    <InfoIcon className="h-4 w-4 text-[#E65A00]" />
    <AlertDescription className="text-white">
      We've pre-selected trusted, beginner-friendly exercises to get you started. You can customize them anytime!
    </AlertDescription>
  </Alert>
);

export default BeginnersGuideAlert;
