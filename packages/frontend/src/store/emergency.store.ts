import create from 'zustand';

interface IEmergencyStore {
  /** currentEmergency 的描述 */
  currentEmergency: EmergencyResponse | null;
  /** loading 的描述 */
  loading: boolean;
  /** error 的描述 */
  error: Error | null;
  /** setEmergency 的描述 */
  setEmergency: (emergency: EmergencyResponse) => void;
  /** clearEmergency 的描述 */
  clearEmergency: () => void;
  /** setError 的描述 */
  setError: (error: Error) => void;
}

export const useEmergencyStore = create<IEmergencyStore>(set => ({
  currentEmergency: null,
  loading: false,
  error: null,
  setEmergency: emergency => set({ currentEmergency: emergency }),
  clearEmergency: () => set({ currentEmergency: null }),
  setError: error => set({ error }),
}));
