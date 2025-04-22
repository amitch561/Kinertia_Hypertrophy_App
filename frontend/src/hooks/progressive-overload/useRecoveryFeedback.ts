
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { RecoveryFeedback } from './types';

export const useRecoveryFeedback = () => {
  const { user } = useAuth();
  const [recoveryFeedback, setRecoveryFeedback] = useState<RecoveryFeedback[]>([]);

  useEffect(() => {
    if (user?.id) {
      const savedFeedback = localStorage.getItem(`recoveryFeedback-${user.id}`);
      if (savedFeedback) {
        setRecoveryFeedback(JSON.parse(savedFeedback));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user?.id && recoveryFeedback.length > 0) {
      localStorage.setItem(`recoveryFeedback-${user.id}`, JSON.stringify(recoveryFeedback));
    }
  }, [recoveryFeedback, user]);

  const updateRecoveryFeedback = (
    muscleGroup: string,
    metric: keyof RecoveryFeedback,
    value: number
  ) => {
    setRecoveryFeedback(prev => {
      const existing = prev.find(f => f.muscleGroup === muscleGroup);
      
      if (existing) {
        return prev.map(f => 
          f.muscleGroup === muscleGroup ? { ...f, [metric]: value } : f
        );
      }
      
      return [...prev, {
        muscleGroup,
        rir: metric === 'rir' ? value : 2,
        pump: metric === 'pump' ? value : 3,
        soreness: metric === 'soreness' ? value : 3,
        fatigue: metric === 'fatigue' ? value : 3
      }];
    });
  };

  return {
    recoveryFeedback,
    updateRecoveryFeedback
  };
};
