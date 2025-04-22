
import React from 'react';
import { Set } from '@/types/workout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table-component";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox-input";

interface ExerciseSetsTableProps {
  sets: Set[];
  exerciseIndex: number;
  onSetChange: (exerciseIndex: number, setIndex: number, field: keyof Set, value: number | boolean) => void;
}

const ExerciseSetsTable: React.FC<ExerciseSetsTableProps> = ({ sets, exerciseIndex, onSetChange }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Set</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Reps</TableHead>
          <TableHead>Complete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sets.map((set, setIndex) => (
          <TableRow key={setIndex}>
            <TableCell>{set.isWarmUp ? 'Warm-up' : `Working ${setIndex + 1}`}</TableCell>
            <TableCell>
              <Input
                type="number"
                value={set.weight}
                onChange={(e) => onSetChange(exerciseIndex, setIndex, 'weight', parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={set.reps}
                onChange={(e) => onSetChange(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={set.completed}
                onCheckedChange={(checked) => onSetChange(exerciseIndex, setIndex, 'completed', !!checked)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExerciseSetsTable;
