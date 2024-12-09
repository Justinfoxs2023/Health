import 'reflect-metadata';
import { bootstrap } from './bootstrap';

bootstrap().catch(error => {
  console.error('Application failed to start:', error);
  process.exit(1);
}); 