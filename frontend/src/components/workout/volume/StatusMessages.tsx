
import React from "react";

interface StatusMessagesProps {
  hasLowVolume: boolean;
  hasHighVolumeNoFocus: boolean;
  hasExceededMRV: boolean;
  volumeLevel: "minimum" | "moderate" | "maximum";
  focusMuscleGroups: string[];
  experience: string;
}

const StatusMessages: React.FC<StatusMessagesProps> = ({
  hasLowVolume,
  hasHighVolumeNoFocus,
  hasExceededMRV,
  volumeLevel,
  focusMuscleGroups,
  experience
}) => {
  return (
    <>
      {hasLowVolume && (
        <p className="mt-3 text-sm text-yellow-400" data-testid="low-volume-warning">
          Some muscle groups are below target volume. Consider adding more exercises.
        </p>
      )}
      
      {hasHighVolumeNoFocus && (
        <p className="mt-3 text-sm text-yellow-400" data-testid="high-volume-warning">
          Volume exceeds the {volumeLevel} target for some muscle groups without focus selection.
          Either add these as focus muscle groups or reduce exercise volume.
        </p>
      )}
      
      {hasExceededMRV && focusMuscleGroups.length > 0 && (
        <p className="mt-3 text-sm text-red-400" data-testid="mrv-warning">
          Warning: Some focus muscle groups are approaching MRV (Maximum Recoverable Volume).
          This is allowed but may impact recovery.
        </p>
      )}
      
      {!hasLowVolume && !hasHighVolumeNoFocus && !hasExceededMRV && (
        <p className="mt-3 text-sm text-green-400" data-testid="optimal-volume">
          Volume looks good! All muscle groups are within their recommended ranges.
        </p>
      )}
      
      {focusMuscleGroups.length > 0 && (
        <p className="mt-2 text-xs text-primary" data-testid="focus-note">
          Focus muscles have adjusted volume targets.
          {experience !== 'advanced' && " Volume is capped at MRV for safety."}
        </p>
      )}
    </>
  );
};

export default StatusMessages;
