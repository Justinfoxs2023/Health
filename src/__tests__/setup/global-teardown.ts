import { testEnv } from './test-environment';

export default async function globalTeardown(): Promise<void> {
  try {
    await testEnv.teardown();
  } catch (error) {
    console.error('Error in globalTeardown:', error);
    throw error;
  }
}
