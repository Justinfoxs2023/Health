import { useContext } from 'react';

import { InjectionContext } from '../contexts/InjectionContext';

export function useInjection<T>(token: any): T {
  const container = useContext(InjectionContext);
  return container.get<T>(token);
}
