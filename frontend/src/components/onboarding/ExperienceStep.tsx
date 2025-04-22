
import { CardContent } from "@/components/ui/card-container";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExperienceStepProps {
  experience: 'beginner' | 'intermediate' | 'advanced';
  setExperience: (experience: 'beginner' | 'intermediate' | 'advanced') => void;
}

export const ExperienceStep = ({ experience, setExperience }: ExperienceStepProps) => {
  const handleExperienceChange = (value: string) => {
    setExperience(value as 'beginner' | 'intermediate' | 'advanced');
  };

  return (
    <CardContent className="space-y-4">
      <Label htmlFor="experience">Experience Level</Label>
      <Select value={experience} onValueChange={handleExperienceChange}>
        <SelectTrigger id="experience" className="bg-[#2F2F2F] border-[#454545] text-white">
          <SelectValue placeholder="Select your experience level" />
        </SelectTrigger>
        <SelectContent className="bg-[#2F2F2F] border-[#454545] text-white">
          <SelectItem value="beginner">Beginner (0-1 year)</SelectItem>
          <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
          <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
        </SelectContent>
      </Select>
    </CardContent>
  );
};
