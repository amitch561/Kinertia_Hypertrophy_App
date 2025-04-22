import { Weight } from 'lucide-react';
import { CardContent } from "@/components/ui/card-container";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PreferencesStepProps {
  availableDays: number;
  setAvailableDays: (days: number) => void;
  weightUnit: 'kg' | 'lbs';
  setWeightUnit: (unit: 'kg' | 'lbs') => void;
}

export const PreferencesStep = ({
  availableDays,
  setAvailableDays,
  weightUnit,
  setWeightUnit
}: PreferencesStepProps) => {
  return (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="days">Available Days Per Week</Label>
        <Select 
          value={availableDays.toString()} 
          onValueChange={(val: string) => setAvailableDays(parseInt(val))}
        >
          <SelectTrigger id="days" className="bg-[#2F2F2F] border-[#454545] text-white">
            <SelectValue placeholder="Select days per week" />
          </SelectTrigger>
          <SelectContent className="bg-[#2F2F2F] border-[#454545] text-white">
            <SelectItem value="1">1 day per week</SelectItem>
            <SelectItem value="2">2 days per week</SelectItem>
            <SelectItem value="3">3 days per week</SelectItem>
            <SelectItem value="4">4 days per week</SelectItem>
            <SelectItem value="5">5 days per week</SelectItem>
            <SelectItem value="6">6 days per week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Weight className="h-4 w-4 text-gray-400" />
          <Label>Preferred Weight Unit</Label>
        </div>
        <RadioGroup
          value={weightUnit}
          onValueChange={(value: 'kg' | 'lbs') => setWeightUnit(value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="kg" id="kg" className="border-[#6A7295] text-[#E65A00]" />
            <Label htmlFor="kg" className="cursor-pointer">Kilograms (kg)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lbs" id="lbs" className="border-[#6A7295] text-[#E66A00]" />
            <Label htmlFor="lbs" className="cursor-pointer">Pounds (lbs)</Label>
          </div>
        </RadioGroup>
      </div>
    </CardContent>
  );
};
