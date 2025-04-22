
import React from "react";
import OrganizedExerciseHeader from "./OrganizedExerciseHeader";
import SelectAllRecommendedButton from "./SelectAllRecommendedButton";
import ExerciseRegionAccordion from "./ExerciseRegionAccordion";

const exerciseRegions: Record<string, { name: string, scientific: string }[]> = {
  chest: [
    { name: "Upper Chest", scientific: "Clavicular Pectoralis Major" },
    { name: "Mid Chest", scientific: "Sternal Pectoralis Major" },
    { name: "Lower Chest", scientific: "Costal Pectoralis Major" }
  ],
  back: [
    { name: "Upper Back", scientific: "Trapezius, Upper Fibers & Rhomboids" },
    { name: "Mid Back", scientific: "Trapezius, Middle Fibers & Latissimus Dorsi" },
    { name: "Lower Back", scientific: "Erector Spinae" }
  ],
  shoulders: [
    { name: "Front Delts", scientific: "Anterior Deltoid" },
    { name: "Lateral Delts", scientific: "Lateral Deltoid" },
    { name: "Rear Delts", scientific: "Posterior Deltoid" }
  ],
  biceps: [
    { name: "Short Head", scientific: "Biceps Brachii, Short Head" },
    { name: "Long Head", scientific: "Biceps Brachii, Long Head" },
    { name: "Brachialis", scientific: "Brachialis" }
  ],
  triceps: [
    { name: "Long Head", scientific: "Triceps Brachii, Long Head" },
    { name: "Lateral Head", scientific: "Triceps Brachii, Lateral Head" },
    { name: "Medial Head", scientific: "Triceps Brachii, Medial Head" }
  ],
  quads: [
    { name: "Outer Quad", scientific: "Vastus Lateralis" },
    { name: "Inner Quad", scientific: "Vastus Medialis" },
    { name: "Mid Quad", scientific: "Rectus Femoris" }
  ],
  hamstrings: [
    { name: "Outer Hamstring", scientific: "Biceps Femoris" },
    { name: "Inner Hamstring", scientific: "Semitendinosus & Semimembranosus" }
  ],
  glutes: [
    { name: "Upper Glutes", scientific: "Gluteus Medius" },
    { name: "Main Glutes", scientific: "Gluteus Maximus" }
  ],
  calves: [
    { name: "Upper Calf", scientific: "Gastrocnemius" },
    { name: "Lower Calf", scientific: "Soleus" }
  ],
  core: [
    { name: "Upper Abs", scientific: "Rectus Abdominis – Upper" },
    { name: "Lower Abs", scientific: "Rectus Abdominis – Lower" },
    { name: "Obliques", scientific: "External & Internal Obliques" }
  ]
};

const getExerciseRegion = (exercise: any, muscleGroup: string): string => {
  const name = exercise.name.toLowerCase();
  
  switch (muscleGroup) {
    case "chest":
      if (name.includes("incline")) return "Upper Chest";
      if (name.includes("decline")) return "Lower Chest";
      return "Mid Chest";
    case "back":
      if (name.includes("pull-up") || name.includes("pulldown")) return "Upper Back";
      if (name.includes("row")) return "Mid Back";
      return "Lower Back";
    case "shoulders":
      if (name.includes("front") || name.includes("press") || name.includes("overhead")) return "Front Delts";
      if (name.includes("lateral") || name.includes("side") || name.includes("raise")) return "Lateral Delts";
      if (name.includes("rear") || name.includes("reverse") || name.includes("bent")) return "Rear Delts";
      const shoulderRegions = ["Front Delts", "Lateral Delts", "Rear Delts"];
      return shoulderRegions[exercise.id.charCodeAt(0) % 3];
    case "biceps":
      if (name.includes("hammer") || name.includes("reverse")) return "Long Head";
      if (name.includes("concentration")) return "Short Head";
      if (name.includes("preacher")) return "Brachialis";
      return "Short Head";
    case "triceps":
      if (name.includes("overhead")) return "Long Head";
      if (name.includes("pushdown")) return "Lateral Head";
      if (name.includes("kickback")) return "Medial Head";
      return "Lateral Head";
    case "quads":
      if (name.includes("leg extension")) return "Mid Quad";
      if (name.includes("squat")) return "Outer Quad";
      if (name.includes("lunge")) return "Inner Quad";
      return "Outer Quad";
    case "hamstrings":
      if (name.includes("leg curl")) return "Outer Hamstring";
      return "Inner Hamstring";
    case "glutes":
      if (name.includes("hip thrust")) return "Main Glutes";
      if (name.includes("abduction")) return "Upper Glutes";
      return "Main Glutes";
    case "calves":
      if (name.includes("standing")) return "Upper Calf";
      return "Lower Calf";
    case "core":
      if (name.includes("crunch")) return "Upper Abs";
      if (name.includes("leg raise")) return "Lower Abs";
      if (name.includes("twist")) return "Obliques";
      return "Upper Abs";
    default:
      return exerciseRegions[muscleGroup]?.[0]?.name || "Other";
  }
};

interface OrganizedExerciseListProps {
  muscleGroup: string;
  exercises: any[];
  selectedExercises: string[];
  onExerciseToggle: (exerciseId: string) => void;
}

const OrganizedExerciseList: React.FC<OrganizedExerciseListProps> = ({
  muscleGroup,
  exercises,
  selectedExercises,
  onExerciseToggle,
}) => {
  const regions = exerciseRegions[muscleGroup] || [];
  const recommendedExercises = exercises.filter(ex => ex.recommended).map(ex => ex.id);

  const handleSelectAllRecommended = () => {
    recommendedExercises.forEach(exerciseId => {
      if (!selectedExercises.includes(exerciseId)) {
        onExerciseToggle(exerciseId);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <OrganizedExerciseHeader
          muscleGroup={muscleGroup}
          exerciseCount={exercises.length}
        />
        <SelectAllRecommendedButton onSelectAll={handleSelectAllRecommended} />
      </div>

      <div className="space-y-3">
        <ExerciseRegionAccordion
          muscleGroup={muscleGroup}
          regions={regions}
          exercises={exercises}
          selectedExercises={selectedExercises}
          onExerciseToggle={onExerciseToggle}
          getExerciseRegion={getExerciseRegion}
        />
      </div>
    </div>
  );
};

export default OrganizedExerciseList;
