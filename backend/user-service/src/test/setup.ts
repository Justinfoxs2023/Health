import 'reflect-metadata';
import { container } from '../di/container';
import { TYPES } from '../di/types';

// Mock dependencies
beforeEach(() => {
  container.snapshot();
});

afterEach(() => {
  container.restore();
}); 