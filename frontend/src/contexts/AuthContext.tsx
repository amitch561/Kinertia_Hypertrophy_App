import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/toast-hook";

type User = {
  id: string;
  email: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  availableDays: number;
  equipment: string[];
  trainingGoal: 'hypertrophy' | 'strength' | 'maintenance';
  priorityMuscles?: string[];
  name?: string;
  photoUrl?: string;
  onboardingComplete?: boolean;
  weightUnit: 'kg' | 'lbs';
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (email && password) {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = storedUsers.find((u: any) => u.email === email);
        
        if (foundUser && foundUser.password === password) {
          const { password, ...userWithoutPassword } = foundUser;
          
          const userWithDefaults: User = {
            ...userWithoutPassword,
            experience: userWithoutPassword.experience || 'beginner',
            availableDays: userWithoutPassword.availableDays || 3,
            equipment: userWithoutPassword.equipment || ['bodyweight'],
            trainingGoal: userWithoutPassword.trainingGoal || 'hypertrophy'
          };
          
          setUser(userWithDefaults);
          localStorage.setItem('user', JSON.stringify(userWithDefaults));
          toast({ 
            title: "Login successful", 
            description: `Welcome back, ${foundUser.name}!` 
          });
        } else {
          throw new Error('Invalid email or password');
        }
      }
    } catch (error) {
      toast({ 
        title: "Login failed", 
        description: error instanceof Error ? error.message : "An error occurred", 
        variant: "destructive" 
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = storedUsers.find((u: any) => u.email === email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      const userLocale = navigator.language;
      const defaultWeightUnit = ['en-US', 'en-GB', 'my'].includes(userLocale) ? 'lbs' as const : 'kg' as const;
      
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        onboardingComplete: false,
        experience: 'beginner' as const,
        availableDays: 3,
        equipment: ['bodyweight'],
        trainingGoal: 'hypertrophy' as const,
        weightUnit: defaultWeightUnit
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({ 
        title: "Account created", 
        description: `Welcome, ${name}!` 
      });
    } catch (error) {
      toast({ 
        title: "Signup failed", 
        description: error instanceof Error ? error.message : "An error occurred", 
        variant: "destructive" 
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('users');
    toast({ 
      title: "Logged out", 
      description: "All user data has been cleared" 
    });
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = storedUsers.map((u: any) => 
        u.id === user.id ? { ...u, ...data } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
