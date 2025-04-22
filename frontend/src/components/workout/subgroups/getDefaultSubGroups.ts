import { Exercise, SubGroup } from "@/types/workout";
import { getSubGroupId } from "@/lib/workout/exercises/exerciseUtils";
import { formatSubGroupName } from "./formatSubGroupName";

export function getDefaultSubGroups(
  muscleGroup: string,
  exercises: Exercise[],
  isPriority = false,
  daySequence = 1,
  pushDaysCount?: number,
  userExperience: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): SubGroup[] {
  switch (muscleGroup.toLowerCase()) {
    case 'quads': 
    case 'hamstrings':
    case 'glutes': {
      // Remove 'primary' suffix and just use the muscle group name
      return [{ 
        id: muscleGroup.toLowerCase(), 
        name: muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1),
        exercises: exercises.filter(e => e.muscleGroup.toLowerCase() === muscleGroup.toLowerCase())
      }];
    }
    case 'chest': {
      return [
        { id: 'chest_upper', name: formatSubGroupName('chest_upper', 'chest'), exercises: exercises.filter(e => getSubGroupId(e) === 'chest_upper') },
        { id: 'chest_mid', name: formatSubGroupName('chest_mid', 'chest'), exercises: exercises.filter(e => getSubGroupId(e) === 'chest_mid') },
        { id: 'chest_lower', name: formatSubGroupName('chest_lower', 'chest'), exercises: exercises.filter(e => getSubGroupId(e) === 'chest_lower') }
      ];
    }
    case 'back': {
      return [
        { id: 'lats', name: formatSubGroupName('lats', 'back'), exercises: exercises.filter(e => getSubGroupId(e) === 'lats') },
        { id: 'back_upper', name: formatSubGroupName('back_upper', 'back'), exercises: exercises.filter(e => getSubGroupId(e) === 'back_upper') },
        { id: 'back_mid', name: formatSubGroupName('back_mid', 'back'), exercises: exercises.filter(e => getSubGroupId(e) === 'back_mid') },
        { id: 'back_lower', name: formatSubGroupName('back_lower', 'back'), exercises: exercises.filter(e => getSubGroupId(e) === 'back_lower') }
      ];
    }
    case 'shoulders': {
      if (isPriority) {
        return [
          { id: 'front_delts', name: formatSubGroupName('front_delts', 'shoulders'), exercises: exercises.filter(e => getSubGroupId(e) === 'front_delts') },
          { id: 'side_delts', name: formatSubGroupName('side_delts', 'shoulders'), exercises: exercises.filter(e => getSubGroupId(e) === 'side_delts') },
          { id: 'rear_delts', name: formatSubGroupName('rear_delts', 'shoulders'), exercises: exercises.filter(e => getSubGroupId(e) === 'rear_delts') }
        ];
      }
      const pushDays = pushDaysCount ?? 2;
      if (pushDays >= 2) {
        const rotation = daySequence % 2;
        if (rotation === 1) {
          return [
            { id: 'side_delts', name: formatSubGroupName('side_delts', 'shoulders'), exercises: exercises.filter(e => getSubGroupId(e) === 'side_delts') }
          ];
        } else {
          return [
            { id: 'rear_delts', name: formatSubGroupName('rear_delts', 'shoulders'), exercises: exercises.filter(e => getSubGroupId(e) === 'rear_delts') }
          ];
        }
      } else {
        return [
          { id: 'side_delts', name: formatSubGroupName('side_delts', 'shoulders'), exercises: exercises.filter(e => getSubGroupId(e) === 'side_delts') }
        ];
      }
    }
    case 'biceps': {
      if (userExperience === 'beginner') {
        return [{ 
          id: 'biceps', 
          name: 'Biceps',
          exercises: exercises.filter(e => e.muscleGroup.toLowerCase() === 'biceps')
        }];
      }
      return [
        { id: 'biceps_long_head', name: formatSubGroupName('biceps_long_head', 'biceps'), exercises: exercises.filter(e => getSubGroupId(e) === 'biceps_long_head') },
        { id: 'biceps_short_head', name: formatSubGroupName('biceps_short_head', 'biceps'), exercises: exercises.filter(e => getSubGroupId(e) === 'biceps_short_head') }
      ];
    }
    case 'triceps': {
      if (userExperience === 'beginner') {
        return [{ 
          id: 'triceps', 
          name: 'Triceps',
          exercises: exercises.filter(e => e.muscleGroup.toLowerCase() === 'triceps')
        }];
      }
      return [
        { id: 'triceps_long_head', name: formatSubGroupName('triceps_long_head', 'triceps'), exercises: exercises.filter(e => getSubGroupId(e) === 'triceps_long_head') },
        { id: 'triceps_lateral_head', name: formatSubGroupName('triceps_lateral_head', 'triceps'), exercises: exercises.filter(e => getSubGroupId(e) === 'triceps_lateral_head') },
        { id: 'triceps_medial_head', name: formatSubGroupName('triceps_medial_head', 'triceps'), exercises: exercises.filter(e => getSubGroupId(e) === 'triceps_medial_head') }
      ];
    }
    
    case 'legs': {
      return [
        { id: 'quadriceps', name: formatSubGroupName('quadriceps', 'legs'), exercises: exercises.filter(e => getSubGroupId(e) === 'quadriceps') },
        { id: 'hamstrings', name: formatSubGroupName('hamstrings', 'legs'), exercises: exercises.filter(e => getSubGroupId(e) === 'hamstrings') },
        { id: 'glutes', name: formatSubGroupName('glutes', 'legs'), exercises: exercises.filter(e => getSubGroupId(e) === 'glutes') },
        { id: 'calves', name: formatSubGroupName('calves', 'legs'), exercises: exercises.filter(e => getSubGroupId(e) === 'calves') },
        { id: 'adductors', name: formatSubGroupName('adductors', 'legs'), exercises: exercises.filter(e => getSubGroupId(e) === 'adductors') },
        { id: 'abductors', name: formatSubGroupName('abductors', 'legs'), exercises: exercises.filter(e => getSubGroupId(e) === 'abductors') }
      ];
    }
    case 'core': {
      return [
        { id: 'upper_abs', name: formatSubGroupName('upper_abs', 'core'), exercises: exercises.filter(e => getSubGroupId(e) === 'upper_abs') },
        { id: 'lower_abs', name: formatSubGroupName('lower_abs', 'core'), exercises: exercises.filter(e => getSubGroupId(e) === 'lower_abs') },
        { id: 'obliques', name: formatSubGroupName('obliques', 'core'), exercises: exercises.filter(e => getSubGroupId(e) === 'obliques') },
        { id: 'transverse_abdominis', name: formatSubGroupName('transverse_abdominis', 'core'), exercises: exercises.filter(e => getSubGroupId(e) === 'transverse_abdominis') },
        { id: 'core_lower_back', name: formatSubGroupName('core_lower_back', 'core'), exercises: exercises.filter(e => getSubGroupId(e) === 'core_lower_back') }
      ];
    }
    case 'forearms': {
      return [
        { id: 'forearm_flexors', name: formatSubGroupName('forearm_flexors', 'forearms'), exercises: exercises.filter(e => getSubGroupId(e) === 'forearm_flexors') },
        { id: 'forearm_extensors', name: formatSubGroupName('forearm_extensors', 'forearms'), exercises: exercises.filter(e => getSubGroupId(e) === 'forearm_extensors') }
      ];
    }
    default: {
      const specificId = `${muscleGroup}_general`;
      return [{ 
        id: specificId, 
        name: `${muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)}`, 
        exercises 
      }];
    }
  }
}
