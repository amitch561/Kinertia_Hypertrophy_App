
import { Card, CardHeader, CardTitle } from "@/components/ui/card-container";
import { Progress } from "@/components/ui/progress";

interface WorkoutHeaderProps {
  name: string;
  day: number;
  completionPercentage: number;
}

const WorkoutHeader = ({ name, day, completionPercentage }: WorkoutHeaderProps) => {
  return (
    <Card className="bg-neutral-light border-neutral rounded-xl mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-white">{name}</CardTitle>
            <p className="text-sm text-gray-400">Day {day}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {completionPercentage}%
            </div>
            <div className="text-xs text-gray-400">completed</div>
          </div>
        </div>
        <Progress value={completionPercentage} className="h-2 mt-2 bg-neutral" />
      </CardHeader>
    </Card>
  );
};

export default WorkoutHeader;
