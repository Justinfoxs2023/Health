import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { HealthData, HealthGoal } from '../types/health';
import { validateHealthData, validateHealthGoal } from '../utils/validators';

interface HealthState {
  healthData: HealthData[];
  goals: HealthGoal[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setHealthData: (data: HealthData[]) => void;
  addHealthData: (data: HealthData) => void;
  updateHealthData: (id: string, data: Partial<HealthData>) => void;
  deleteHealthData: (id: string) => void;
  
  setGoals: (goals: HealthGoal[]) => void;
  addGoal: (goal: HealthGoal) => void;
  updateGoal: (id: string, goal: Partial<HealthGoal>) => void;
  deleteGoal: (id: string) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useHealthStore = create<HealthState>()(
  devtools(
    persist(
      (set) => ({
        healthData: [],
        goals: [],
        loading: false,
        error: null,

        setHealthData: (data) => {
          try {
            const validatedData = data.map(validateHealthData);
            set({ healthData: validatedData });
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '数据验证失败' });
          }
        },

        addHealthData: (data) => {
          try {
            const validatedData = validateHealthData(data);
            set((state) => ({
              healthData: [...state.healthData, validatedData],
            }));
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '数据验证失败' });
          }
        },

        updateHealthData: (id, data) => {
          set((state) => ({
            healthData: state.healthData.map((item) =>
              item.id === id ? { ...item, ...data } : item
            ),
          }));
        },

        deleteHealthData: (id) => {
          set((state) => ({
            healthData: state.healthData.filter((item) => item.id !== id),
          }));
        },

        setGoals: (goals) => {
          try {
            const validatedGoals = goals.map(validateHealthGoal);
            set({ goals: validatedGoals });
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '目标验证失败' });
          }
        },

        addGoal: (goal) => {
          try {
            const validatedGoal = validateHealthGoal(goal);
            set((state) => ({
              goals: [...state.goals, validatedGoal],
            }));
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '目标验证失败' });
          }
        },

        updateGoal: (id, goal) => {
          set((state) => ({
            goals: state.goals.map((item) =>
              item.id === id ? { ...item, ...goal } : item
            ),
          }));
        },

        deleteGoal: (id) => {
          set((state) => ({
            goals: state.goals.filter((item) => item.id !== id),
          }));
        },

        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
      }),
      {
        name: 'health-store',
      }
    )
  )
); 