
import React, { useState, useEffect } from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getSubGroupId } from "@/lib/workout/exercises/exerciseUtils";
import type { SubGroup, Exercise } from "@/types/workout";
import ExercisePickerSearch from "./ExercisePickerSearch";
import { ExercisePickerExerciseList } from "./ExercisePickerExerciseList";
import ExercisePickerHeader from "./ExercisePickerHeader";
import ExercisePickerFilters from "./ExercisePickerFilters";

const ExercisePickerModal = ({
  open,
  onClose,
  groupId,
  subGroup,
  onSelectExercise,
  selectedExercises = [],
  focusMuscleGroups = []
}: {
  open: boolean;
  onClose: () => void;
  groupId: string;
  subGroup: SubGroup | null;
  onSelectExercise?: (exerciseId: string) => void;
  selectedExercises?: string[];
  focusMuscleGroups?: string[];
}) => {
  const { exercises } = useWorkout();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setFilterType(null);
    }
  }, [open]);

  useEffect(() => {
    let filtered = [...exercises];
    if (groupId) {
      filtered = filtered.filter(ex => ex.muscleGroup === groupId);
    }
    if (subGroup && subGroup.id) {
      filtered = filtered.filter(ex => getSubGroupId(ex) === subGroup.id.toLowerCase());
    }
    if (filterType) {
      filtered = filtered.filter(ex => ex.exerciseType === filterType);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(query) || 
        ex.equipment?.some(eq => eq.toLowerCase().includes(query))
      );
    }
    filtered.sort((a, b) => {
      if (a.recommended && !b.recommended) return -1;
      if (!a.recommended && b.recommended) return 1;
      if (a.exerciseType === 'compound' && b.exerciseType !== 'compound') return -1;
      if (a.exerciseType !== 'compound' && b.exerciseType === 'compound') return 1;
      return a.name.localeCompare(b.name);
    });
    setFilteredExercises(filtered);
  }, [exercises, groupId, subGroup, searchQuery, filterType]);

  const handleSelectExercise = (exerciseId: string) => {
    if (onSelectExercise) {
      onSelectExercise(exerciseId);
      onClose();
    }
  };

  const toggleFilterType = (type: string) => {
    setFilterType(filterType === type ? null : type);
  };

  return (
    <Dialog open={open} onOpenChange={openVal => !openVal ? onClose() : undefined}>
      <DialogContent className="bg-[#22252d] border-[#3A3A3A] max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <ExercisePickerHeader />

        <ExercisePickerSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          toggleFilterType={toggleFilterType}
        />

        <ExercisePickerFilters
          groupId={groupId}
          subGroup={subGroup}
        />

        <div className="overflow-y-auto flex-grow px-1 py-2">
          <ExercisePickerExerciseList
            groupId={groupId}
            subGroupId={subGroup?.id || null}
            exercises={filteredExercises}
            selectedExercises={selectedExercises}
            onSelectExercise={handleSelectExercise}
            focusMuscleGroups={focusMuscleGroups}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExercisePickerModal;
