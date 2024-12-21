import { testEnv } from './test-environment';

export default async function globalSetup(): Promise<void> {
  try {
    await testEnv.setup();
    process.env.NODE_ENV = 'test';
  } catch (error) {
    console.error('Error in globalSetup:', error);
    throw error;
  }
}
