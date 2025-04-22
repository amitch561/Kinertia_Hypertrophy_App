import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button-component";
import { ThumbsDown, ThumbsUp, Check, ArrowRight, CheckCircle } from 'lucide-react';

interface WorkoutFeedbackProps {
  feedbackSelection: 'too_easy' | 'just_right' | 'too_hard' | null;
  onFeedbackSelect: (feedback: 'too_easy' | 'just_right' | 'too_hard') => void;
  onComplete: () => void;
}

const WorkoutFeedback: React.FC<WorkoutFeedbackProps> = ({
  feedbackSelection,
  onFeedbackSelect,
  onComplete,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-[#E65A00]" />
          Workout Complete
        </CardTitle>
        <CardDescription>How did this workout feel?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            className={`flex-1 border-[#454545] ${
              feedbackSelection === 'too_easy' 
                ? 'bg-[#E65A00] text-white border-[#E65A00]' 
                : 'hover:bg-[#3A3A3A] hover:text-white'
            }`}
            onClick={() => onFeedbackSelect('too_easy')}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Too Easy
          </Button>
          <Button
            variant="outline"
            className={`flex-1 border-[#454545] ${
              feedbackSelection === 'just_right' 
                ? 'bg-[#E65A00] text-white border-[#E65A00]' 
                : 'hover:bg-[#3A3A3A] hover:text-white'
            }`}
            onClick={() => onFeedbackSelect('just_right')}
          >
            <Check className="h-4 w-4 mr-2" />
            Just Right
          </Button>
          <Button
            variant="outline"
            className={`flex-1 border-[#454545] ${
              feedbackSelection === 'too_hard' 
                ? 'bg-[#E65A00] text-white border-[#E65A00]' 
                : 'hover:bg-[#3A3A3A] hover:text-white'
            }`}
            onClick={() => onFeedbackSelect('too_hard')}
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Too Hard
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-[#E65A00] hover:bg-[#FF7A22]"
          onClick={onComplete}
        >
          Complete Workout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutFeedback;
