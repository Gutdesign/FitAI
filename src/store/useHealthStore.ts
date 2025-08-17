import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  jobTitle: string;
  workHours: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  equipment: string[];
  restrictions: string[];
  preferences: {
    workoutTime: string;
    duration: number;
    reminderTime: string;
  };
}

export interface Workout {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'break';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  equipment: string[];
  description: string;
  instructions: string[];
  category: 'desk' | 'home' | 'gym' | 'outdoor';
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  date: string;
  duration: number;
  completed: boolean;
  rating?: number;
  notes?: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  energy: number; // 1-5 scale
  stress: number; // 1-5 scale
  sleep: number; // hours
  notes?: string;
}

interface HealthState {
  // User data
  user: User | null;
  isOnboarded: boolean;
  
  // Workouts
  workouts: Workout[];
  workoutSessions: WorkoutSession[];
  
  // Tracking
  moodEntries: MoodEntry[];
  
  // UI state
  activeTab: string;
  
  // Actions
  setUser: (user: User) => void;
  completeOnboarding: () => void;
  setActiveTab: (tab: string) => void;
  addWorkoutSession: (session: WorkoutSession) => void;
  addMoodEntry: (entry: MoodEntry) => void;
  updateWorkoutSession: (id: string, updates: Partial<WorkoutSession>) => void;
  
  // Analytics
  getWeeklyStats: () => {
    workoutsCompleted: number;
    averageMood: number;
    averageEnergy: number;
    totalMinutes: number;
  };
  
  getStreakDays: () => number;
}

const defaultWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Desk Break Stretch',
    type: 'flexibility',
    duration: 5,
    difficulty: 'easy',
    equipment: [],
    description: 'Quick desk stretches to relieve tension',
    instructions: [
      'Neck rolls - 5 in each direction',
      'Shoulder shrugs - 10 reps',
      'Seated spinal twist - hold 15 seconds each side',
      'Wrist circles - 10 in each direction'
    ],
    category: 'desk'
  },
  {
    id: '2',
    name: 'Power 15 HIIT',
    type: 'cardio',
    duration: 15,
    difficulty: 'medium',
    equipment: [],
    description: 'High-intensity interval training for busy schedules',
    instructions: [
      '2 minutes warm-up (light jogging in place)',
      '30 seconds burpees, 30 seconds rest - repeat 3 times',
      '30 seconds mountain climbers, 30 seconds rest - repeat 3 times',
      '30 seconds jumping jacks, 30 seconds rest - repeat 2 times',
      '2 minutes cool-down stretching'
    ],
    category: 'home'
  },
  {
    id: '3',
    name: 'Strength Essentials',
    type: 'strength',
    duration: 20,
    difficulty: 'medium',
    equipment: ['dumbbells'],
    description: 'Basic strength training with minimal equipment',
    instructions: [
      'Push-ups: 3 sets of 10-15',
      'Dumbbell rows: 3 sets of 12',
      'Squats: 3 sets of 15',
      'Plank: 3 sets of 30 seconds',
      'Dumbbell overhead press: 3 sets of 10'
    ],
    category: 'home'
  }
];

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isOnboarded: false,
      workouts: defaultWorkouts,
      workoutSessions: [],
      moodEntries: [],
      activeTab: 'chat',
      
      // Actions
      setUser: (user) => set({ user }),
      
      completeOnboarding: () => set({ isOnboarded: true }),
      
      setActiveTab: (activeTab) => set({ activeTab }),
      
      addWorkoutSession: (session) =>
        set((state) => ({
          workoutSessions: [...state.workoutSessions, session]
        })),
      
      addMoodEntry: (entry) =>
        set((state) => ({
          moodEntries: [...state.moodEntries, entry]
        })),
      
      updateWorkoutSession: (id, updates) =>
        set((state) => ({
          workoutSessions: state.workoutSessions.map((session) =>
            session.id === id ? { ...session, ...updates } : session
          )
        })),
      
      // Analytics
      getWeeklyStats: () => {
        const state = get();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentSessions = state.workoutSessions.filter(
          (session) => new Date(session.date) >= oneWeekAgo && session.completed
        );
        
        const recentMoods = state.moodEntries.filter(
          (entry) => new Date(entry.date) >= oneWeekAgo
        );
        
        return {
          workoutsCompleted: recentSessions.length,
          averageMood: recentMoods.length > 0 
            ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length 
            : 0,
          averageEnergy: recentMoods.length > 0
            ? recentMoods.reduce((sum, entry) => sum + entry.energy, 0) / recentMoods.length
            : 0,
          totalMinutes: recentSessions.reduce((sum, session) => sum + session.duration, 0)
        };
      },
      
      getStreakDays: () => {
        const state = get();
        const sessions = [...state.workoutSessions]
          .filter(session => session.completed)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (sessions.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        for (const session of sessions) {
          const sessionDate = new Date(session.date);
          sessionDate.setHours(0, 0, 0, 0);
          
          const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === streak) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else if (diffDays > streak) {
            break;
          }
        }
        
        return streak;
      }
    }),
    {
      name: 'health-store',
      partialize: (state) => ({
        user: state.user,
        isOnboarded: state.isOnboarded,
        workoutSessions: state.workoutSessions,
        moodEntries: state.moodEntries
      })
    }
  )
);