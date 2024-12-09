import { ApiResponse } from './types';

export interface ExerciseStats {
  weeklyStats: {
    date: string;
    duration: number;
    calories: number;
    completedExercises: number;
  }[];
  monthlyStats: {
    month: string;
    totalDuration: number;
    totalCalories: number;
    completedDays: number;
  }[];
  exerciseTypeStats: {
    type: string;
    duration: number;
    calories: number;
    count: number;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    achieved: boolean;
    achievedAt?: string;
  }[];
}

export const getExerciseStats = async (): Promise<ApiResponse<ExerciseStats>> => {
  const response = await fetch('/api/exercise/stats');
  return response.json();
};

export interface ExerciseRecord {
  id: string;
  date: string;
  exercises: {
    id: string;
    name: string;
    type: string;
    duration: number;
    calories: number;
    sets?: number;
    reps?: number;
  }[];
  totalDuration: number;
  totalCalories: number;
  completed: boolean;
}

export const getExerciseHistory = async (): Promise<ApiResponse<ExerciseRecord[]>> => {
  const response = await fetch('/api/exercise/history');
  return response.json();
};

export interface ExercisePlan {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  calories: number;
  category: string;
  imageUrl: string;
  tags: string[];
  exercises: {
    id: string;
    name: string;
    duration: number;
    sets?: number;
    reps?: number;
  }[];
}

export const getExerciseRecommendations = async (): Promise<ApiResponse<ExercisePlan[]>> => {
  const response = await fetch('/api/exercise/recommendations');
  return response.json();
};

export interface ExerciseVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  viewCount: number;
  tags: string[];
}

export const getExerciseVideos = async (): Promise<ApiResponse<ExerciseVideo[]>> => {
  const response = await fetch('/api/exercise/videos');
  return response.json();
};

export interface VideoDetail {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  instructor: {
    id: string;
    name: string;
    avatarUrl: string;
    description: string;
  };
  relatedVideos: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
  }[];
  sections: {
    title: string;
    startTime: number;
    description?: string;
  }[];
  tips: string[];
}

export const getExerciseVideoDetail = async (id: string): Promise<ApiResponse<VideoDetail>> => {
  const response = await fetch(`/api/exercise/videos/${id}`);
  return response.json();
};

export const updateVideoProgress = async (params: { videoId: string; progress: number }): Promise<ApiResponse<void>> => {
  const response = await fetch('/api/exercise/videos/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
  return response.json();
};

export interface ExerciseGoals {
  weeklyFrequency: number;
  weeklyDuration: number;
  weeklyCalories: number;
  preferredTime: 'morning' | 'afternoon' | 'evening';
  focusAreas: string[];
  intensity: 'low' | 'medium' | 'high';
  reminders: boolean;
}

export const getExerciseGoals = async (): Promise<ApiResponse<ExerciseGoals>> => {
  const response = await fetch('/api/exercise/goals');
  return response.json();
};

export const updateExerciseGoals = async (goals: ExerciseGoals): Promise<ApiResponse<void>> => {
  const response = await fetch('/api/exercise/goals', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(goals)
  });
  return response.json();
};

export interface ExercisePlanDetail {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  calories: number;
  category: string;
  imageUrl: string;
  tags: string[];
  schedule: {
    dayOfWeek: number;
    exercises: {
      id: string;
      name: string;
      type: string;
      duration: number;
      sets?: number;
      reps?: number;
      calories: number;
      videoUrl?: string;
      description: string;
      tips: string[];
    }[];
  }[];
  requirements: string[];
  benefits: string[];
}

export const getExercisePlanDetail = async (id: string): Promise<ApiResponse<ExercisePlanDetail>> => {
  const response = await fetch(`/api/exercise/plans/${id}`);
  return response.json();
};

export const startExercisePlan = async (planId: string): Promise<ApiResponse<void>> => {
  const response = await fetch('/api/exercise/plans/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ planId })
  });
  return response.json();
};

export interface ExerciseProgress {
  planId: string;
  currentDay: number;
  exercises: {
    id: string;
    name: string;
    type: string;
    duration: number;
    calories: number;
    sets?: number;
    reps?: number;
    completed: boolean;
    startTime?: string;
    endTime?: string;
  }[];
  totalDuration: number;
  completedDuration: number;
  totalCalories: number;
  burnedCalories: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
}

export const getExerciseProgress = async (planId: string): Promise<ApiResponse<ExerciseProgress>> => {
  const response = await fetch(`/api/exercise/plans/${planId}/progress`);
  return response.json();
};

export const completeExercise = async (exerciseId: string): Promise<ApiResponse<void>> => {
  const response = await fetch(`/api/exercise/exercises/${exerciseId}/complete`, {
    method: 'POST'
  });
  return response.json();
};

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'steps' | 'distance' | 'calories' | 'duration';
  target: number;
  startDate: string;
  endDate: string;
  participants: {
    count: number;
    list: {
      id: string;
      name: string;
      avatar: string;
      progress: number;
    }[];
  };
  rewards: {
    type: 'points' | 'badge' | 'coupon';
    value: string;
    icon: string;
  }[];
  rules: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  isJoined: boolean;
}

export const getChallenges = async (): Promise<ApiResponse<Challenge[]>> => {
  const response = await fetch('/api/exercise/challenges');
  return response.json();
};

export const joinChallenge = async (challengeId: string): Promise<ApiResponse<void>> => {
  const response = await fetch(`/api/exercise/challenges/${challengeId}/join`, {
    method: 'POST'
  });
  return response.json();
};

export const quitChallenge = async (challengeId: string): Promise<ApiResponse<void>> => {
  const response = await fetch(`/api/exercise/challenges/${challengeId}/quit`, {
    method: 'POST'
  });
  return response.json();
};

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'exercise' | 'challenge' | 'social';
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  target: number;
  achieved: boolean;
  achievedAt?: string;
  rewards: {
    type: 'points' | 'badge' | 'coupon';
    value: string;
    icon: string;
  }[];
}

export const getAchievements = async (): Promise<ApiResponse<Achievement[]>> => {
  const response = await fetch('/api/exercise/achievements');
  return response.json();
}; 