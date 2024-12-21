import { IApiResponse } from './types';

export interface IExerciseStats {
  /** weeklyStats 的描述 */
  weeklyStats: {
    date: string;
    duration: number;
    calories: number;
    completedExercises: number;
  }[];
  /** monthlyStats 的描述 */
  monthlyStats: {
    month: string;
    totalDuration: number;
    totalCalories: number;
    completedDays: number;
  }[];
  /** exerciseTypeStats 的描述 */
  exerciseTypeStats: {
    type: string;
    duration: number;
    calories: number;
    count: number;
  }[];
  /** achievements 的描述 */
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

export const getExerciseStats = async (): Promise<IApiResponse<IExerciseStats>> => {
  const response = await fetch('/api/exercise/stats');
  return response.json();
};

export interface IExerciseRecord {
  /** id 的描述 */
  id: string;
  /** date 的描述 */
  date: string;
  /** exercises 的描述 */
  exercises: {
    id: string;
    name: string;
    type: string;
    duration: number;
    calories: number;
    sets?: number;
    reps?: number;
  }[];
  /** totalDuration 的描述 */
  totalDuration: number;
  /** totalCalories 的描述 */
  totalCalories: number;
  /** completed 的描述 */
  completed: boolean;
}

export const getExerciseHistory = async (): Promise<IApiResponse<IExerciseRecord[]>> => {
  const response = await fetch('/api/exercise/history');
  return response.json();
};

export interface IExercisePlan {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** level 的描述 */
  level: 'beginner' | 'intermediate' | 'advanced';
  /** duration 的描述 */
  duration: number;
  /** calories 的描述 */
  calories: number;
  /** category 的描述 */
  category: string;
  /** imageUrl 的描述 */
  imageUrl: string;
  /** tags 的描述 */
  tags: string[];
  /** exercises 的描述 */
  exercises: {
    id: string;
    name: string;
    duration: number;
    sets?: number;
    reps?: number;
  }[];
}

export const getExerciseRecommendations = async (): Promise<IApiResponse<IExercisePlan[]>> => {
  const response = await fetch('/api/exercise/recommendations');
  return response.json();
};

export interface IExerciseVideo {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** thumbnailUrl 的描述 */
  thumbnailUrl: string;
  /** videoUrl 的描述 */
  videoUrl: string;
  /** duration 的描述 */
  duration: number;
  /** category 的描述 */
  category: string;
  /** level 的描述 */
  level: 'beginner' | 'intermediate' | 'advanced';
  /** instructor 的描述 */
  instructor: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  /** viewCount 的描述 */
  viewCount: number;
  /** tags 的描述 */
  tags: string[];
}

export const getExerciseVideos = async (): Promise<IApiResponse<IExerciseVideo[]>> => {
  const response = await fetch('/api/exercise/videos');
  return response.json();
};

export interface IVideoDetail {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** videoUrl 的描述 */
  videoUrl: string;
  /** duration 的描述 */
  duration: number;
  /** instructor 的描述 */
  instructor: {
    id: string;
    name: string;
    avatarUrl: string;
    description: string;
  };
  /** relatedVideos 的描述 */
  relatedVideos: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
  }[];
  /** sections 的描述 */
  sections: {
    title: string;
    startTime: number;
    description?: string;
  }[];
  /** tips 的描述 */
  tips: string[];
}

export const getExerciseVideoDetail = async (id: string): Promise<IApiResponse<IVideoDetail>> => {
  const response = await fetch(`/api/exercise/videos/${id}`);
  return response.json();
};

export const updateVideoProgress = async (params: {
  videoId: string;
  progress: number;
}): Promise<IApiResponse<void>> => {
  const response = await fetch('/api/exercise/videos/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return response.json();
};

export interface IExerciseGoals {
  /** weeklyFrequency 的描述 */
  weeklyFrequency: number;
  /** weeklyDuration 的描述 */
  weeklyDuration: number;
  /** weeklyCalories 的描述 */
  weeklyCalories: number;
  /** preferredTime 的描述 */
  preferredTime: 'morning' | 'afternoon' | 'evening';
  /** focusAreas 的描述 */
  focusAreas: string[];
  /** intensity 的描述 */
  intensity: 'low' | 'medium' | 'high';
  /** reminders 的描述 */
  reminders: boolean;
}

export const getExerciseGoals = async (): Promise<IApiResponse<IExerciseGoals>> => {
  const response = await fetch('/api/exercise/goals');
  return response.json();
};

export const updateExerciseGoals = async (goals: IExerciseGoals): Promise<IApiResponse<void>> => {
  const response = await fetch('/api/exercise/goals', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(goals),
  });
  return response.json();
};

export interface IExercisePlanDetail {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** level 的描述 */
  level: 'beginner' | 'intermediate' | 'advanced';
  /** duration 的描述 */
  duration: number;
  /** calories 的描述 */
  calories: number;
  /** category 的描述 */
  category: string;
  /** imageUrl 的描述 */
  imageUrl: string;
  /** tags 的描述 */
  tags: string[];
  /** schedule 的描述 */
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
  /** requirements 的描述 */
  requirements: string[];
  /** benefits 的描述 */
  benefits: string[];
}

export const getExercisePlanDetail = async (
  id: string,
): Promise<IApiResponse<IExercisePlanDetail>> => {
  const response = await fetch(`/api/exercise/plans/${id}`);
  return response.json();
};

export const startExercisePlan = async (planId: string): Promise<IApiResponse<void>> => {
  const response = await fetch('/api/exercise/plans/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ planId }),
  });
  return response.json();
};

export interface IExerciseProgress {
  /** planId 的描述 */
  planId: string;
  /** currentDay 的描述 */
  currentDay: number;
  /** exercises 的描述 */
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
  /** totalDuration 的描述 */
  totalDuration: number;
  /** completedDuration 的描述 */
  completedDuration: number;
  /** totalCalories 的描述 */
  totalCalories: number;
  /** burnedCalories 的描述 */
  burnedCalories: number;
  /** status 的描述 */
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
}

export const getExerciseProgress = async (
  planId: string,
): Promise<IApiResponse<IExerciseProgress>> => {
  const response = await fetch(`/api/exercise/plans/${planId}/progress`);
  return response.json();
};

export const completeExercise = async (exerciseId: string): Promise<IApiResponse<void>> => {
  const response = await fetch(`/api/exercise/exercises/${exerciseId}/complete`, {
    method: 'POST',
  });
  return response.json();
};

export interface IChallenge {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** type 的描述 */
  type: 'steps' | 'distance' | 'calories' | 'duration';
  /** target 的描述 */
  target: number;
  /** startDate 的描述 */
  startDate: string;
  /** endDate 的描述 */
  endDate: string;
  /** participants 的描述 */
  participants: {
    count: number;
    list: {
      id: string;
      name: string;
      avatar: string;
      progress: number;
    }[];
  };
  /** rewards 的描述 */
  rewards: {
    type: 'points' | 'badge' | 'coupon';
    value: string;
    icon: string;
  }[];
  /** rules 的描述 */
  rules: string[];
  /** status 的描述 */
  status: 'upcoming' | 'ongoing' | 'completed';
  /** isJoined 的描述 */
  isJoined: boolean;
}

export const getChallenges = async (): Promise<IApiResponse<IChallenge[]>> => {
  const response = await fetch('/api/exercise/challenges');
  return response.json();
};

export const joinChallenge = async (challengeId: string): Promise<IApiResponse<void>> => {
  const response = await fetch(`/api/exercise/challenges/${challengeId}/join`, {
    method: 'POST',
  });
  return response.json();
};

export const quitChallenge = async (challengeId: string): Promise<IApiResponse<void>> => {
  const response = await fetch(`/api/exercise/challenges/${challengeId}/quit`, {
    method: 'POST',
  });
  return response.json();
};

export interface IAchievement {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** icon 的描述 */
  icon: string;
  /** category 的描述 */
  category: 'exercise' | 'challenge' | 'social';
  /** level 的描述 */
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  /** progress 的描述 */
  progress: number;
  /** target 的描述 */
  target: number;
  /** achieved 的描述 */
  achieved: boolean;
  /** achievedAt 的描述 */
  achievedAt?: string;
  /** rewards 的描述 */
  rewards: {
    type: 'points' | 'badge' | 'coupon';
    value: string;
    icon: string;
  }[];
}

export const getAchievements = async (): Promise<IApiResponse<IAchievement[]>> => {
  const response = await fetch('/api/exercise/achievements');
  return response.json();
};
