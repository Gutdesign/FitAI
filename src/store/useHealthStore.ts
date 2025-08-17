import { create } from 'zustand';

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
    name: 'Растяжка на рабочем месте',
    type: 'flexibility',
    duration: 5,
    difficulty: 'easy',
    equipment: [],
    description: 'Быстрая растяжка для снятия напряжения',
    instructions: [
      'Повороты шеи - по 5 в каждую сторону',
      'Подъемы плеч - 10 повторений',
      'Поворот корпуса сидя - держать 15 секунд в каждую сторону',
      'Круги запястьями - по 10 в каждую сторону'
    ],
    category: 'desk'
  },
  {
    id: '2',
    name: 'Силовая 15 мин',
    type: 'cardio',
    duration: 15,
    difficulty: 'medium',
    equipment: [],
    description: 'Интенсивная интервальная тренировка для занятых',
    instructions: [
      '2 минуты разминка (легкий бег на месте)',
      '30 секунд берпи, 30 секунд отдых - повторить 3 раза',
      '30 секунд альпинист, 30 секунд отдых - повторить 3 раза',
      '30 секунд прыжки, 30 секунд отдых - повторить 2 раза',
      '2 минуты растяжка'
    ],
    category: 'home'
  },
  {
    id: '3',
    name: 'Основы силовых',
    type: 'strength',
    duration: 20,
    difficulty: 'medium',
    equipment: ['гантели'],
    description: 'Базовая силовая тренировка с минимальным оборудованием',
    instructions: [
      'Отжимания: 3 подхода по 10-15',
      'Тяга гантелей: 3 подхода по 12',
      'Приседания: 3 подхода по 15',
      'Планка: 3 подхода по 30 секунд',
      'Жим гантелей над головой: 3 подхода по 10'
    ],
    category: 'home'
  }
];

export const useHealthStore = create<HealthState>((set, get) => ({
  // Initial state
  user: null,
  isOnboarded: false,
  workouts: defaultWorkouts,
  workoutSessions: [],
  moodEntries: [],
  activeTab: 'dashboard',
  
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
}));