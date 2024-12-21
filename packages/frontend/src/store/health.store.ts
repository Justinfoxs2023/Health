import create from 'zustand';
import { HealthData, HealthGoal } from '../types/health';
import { devtools, persist } from 'zustand/middleware';
import { validateHealthData, validateHealthGoal } from '../utils/validators';

interface IHealthState {
  /** healthData 的描述 */
  healthData: HealthData[];
  /** goals 的描述 */
  goals: HealthGoal[];
  /** loading 的描述 */
  loading: boolean;
  /** error 的描述 */
  error: string | null;

  // Actions
  /** setHealthData 的描述 */
  setHealthData: (data: HealthData[]) => void;
  /** addHealthData 的描述 */
  addHealthData: (data: HealthData) => void;
  /** updateHealthData 的描述 */
  updateHealthData: (id: string, data: Partial<HealthData>) => void;
  /** deleteHealthData 的描述 */
  deleteHealthData: (id: string) => void;

  /** setGoals 的描述 */
  setGoals: (goals: HealthGoal[]) => void;
  /** addGoal 的描述 */
  addGoal: (goal: HealthGoal) => void;
  /** updateGoal 的描述 */
  updateGoal: (id: string, goal: Partial<HealthGoal>) => void;
  /** deleteGoal 的描述 */
  deleteGoal: (id: string) => void;

  /** setLoading 的描述 */
  setLoading: (loading: boolean) => void;
  /** setError 的描述 */
  setError: (error: string | null) => void;
}

export const useHealthStore = create<IHealthState>()(
  devtools(
    persist(
      set => ({
        healthData: [],
        goals: [],
        loading: false,
        error: null,

        setHealthData: data => {
          try {
            const validatedData = data.map(validateHealthData);
            set({ healthData: validatedData });
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '数据验证失败' });
          }
        },

        addHealthData: data => {
          try {
            const validatedData = validateHealthData(data);
            set(state => ({
              healthData: [...state.healthData, validatedData],
            }));
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '数据验证失败' });
          }
        },

        updateHealthData: (id, data) => {
          set(state => ({
            healthData: state.healthData.map(item =>
              item.id === id ? { ...item, ...data } : item,
            ),
          }));
        },

        deleteHealthData: id => {
          set(state => ({
            healthData: state.healthData.filter(item => item.id !== id),
          }));
        },

        setGoals: goals => {
          try {
            const validatedGoals = goals.map(validateHealthGoal);
            set({ goals: validatedGoals });
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '目标验证失败' });
          }
        },

        addGoal: goal => {
          try {
            const validatedGoal = validateHealthGoal(goal);
            set(state => ({
              goals: [...state.goals, validatedGoal],
            }));
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '目标验证失败' });
          }
        },

        updateGoal: (id, goal) => {
          set(state => ({
            goals: state.goals.map(item => (item.id === id ? { ...item, ...goal } : item)),
          }));
        },

        deleteGoal: id => {
          set(state => ({
            goals: state.goals.filter(item => item.id !== id),
          }));
        },

        setLoading: loading => set({ loading }),
        setError: error => set({ error }),
      }),
      {
        name: 'health-store',
      },
    ),
  ),
);
