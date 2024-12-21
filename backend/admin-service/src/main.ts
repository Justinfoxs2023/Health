import 'reflect-metadata';
import { ILogger } from './types/logger';
import { TYPES } from './di/types';
import { bootstrap } from './bootstrap';
import { container } from './bootstrap';

async function main(): Promise<void> {
  try {
    const logger = container.get<ILogger>(TYPES.Logger);
    logger.info('Starting application...');

    await bootstrap();

    logger.info('Application started successfully');
  } catch (error) {
    console.error('Error in main.ts:', 'Failed to start application:', error);
    process.exit(1);
  }
}

main();
