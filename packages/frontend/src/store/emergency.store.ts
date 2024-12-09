import create from 'zustand';

interface EmergencyStore {
  currentEmergency: EmergencyResponse | null;
  loading: boolean;
  error: Error | null;
  setEmergency: (emergency: EmergencyResponse) => void;
  clearEmergency: () => void;
  setError: (error: Error) => void;
}

export const useEmergencyStore = create<EmergencyStore>((set) => ({
  currentEmergency: null,
  loading: false,
  error: null,
  setEmergency: (emergency) => set({ currentEmergency: emergency }),
  clearEmergency: () => set({ currentEmergency: null }),
  setError: (error) => set({ error })
})); 