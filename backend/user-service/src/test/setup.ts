import 'reflect-metadata';
import { TYPES } from '../di/types';
import { container } from '../di/container';

// Mock dependencies
beforeEach(() => {
  container.snapshot();
});

afterEach(() => {
  container.restore();
});
