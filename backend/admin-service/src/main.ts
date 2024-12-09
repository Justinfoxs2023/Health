import 'reflect-metadata';
import { bootstrap } from './bootstrap';
import { Logger } from './types/logger';
import { container } from './bootstrap';
import { TYPES } from './di/types';

async function main() {
  try {
    const logger = container.get<Logger>(TYPES.Logger);
    logger.info('Starting application...');
    
    await bootstrap();
    
    logger.info('Application started successfully');
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

main(); 