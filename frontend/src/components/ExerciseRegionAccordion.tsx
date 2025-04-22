
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import ExerciseListItem from "./ExerciseListItem";

interface Region {
  name: string;
  scientific: string;
}

interface ExerciseRegionAccordionProps {
  muscleGroup: string;
  regions: Region[];
  exercises: any[];
  selectedExercises: string[];
  onExerciseToggle: (exerciseId: string) => void;
  getExerciseRegion: (exercise: any, muscleGroup: string) => string;
}

const ExerciseRegionAccordion: React.FC<ExerciseRegionAccordionProps> = ({
  muscleGroup,
  regions,
  exercises,
  selectedExercises,
  onExerciseToggle,
  getExerciseRegion,
}) => {
  return (
    <Accordion type="multiple" className="space-y-2">
      {regions.map((region) => {
        const regionExercises = exercises.filter(
          (exercise) => getExerciseRegion(exercise, muscleGroup) === region.name
        );
        if (regionExercises.length === 0) return null;

        return (
          <AccordionItem 
            key={region.name} 
            value={region.name} 
            className="border-l border-[#454545] pl-3 border-b-0"
          >
            <AccordionTrigger className="py-2 text-sm font-medium hover:bg-[#353535] transition-colors rounded-md px-3">
              <span>
                {region.name}
                <span className="text-gray-400 text-xs ml-2">
                  ({region.scientific})
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-3 space-y-2">
              {regionExercises.map((exercise) => (
                <ExerciseListItem
                  key={exercise.id}
                  exercise={exercise}
                  checked={selectedExercises.includes(exercise.id)}
                  onToggle={() => onExerciseToggle(exercise.id)}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default ExerciseRegionAccordion;
