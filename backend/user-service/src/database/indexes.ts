import { HealthData } from '../models/health-data.model';
import { Logger } from '../utils/logger';
import { Notification } from '../models/notification.model';
import { Profile } from '../models/profile.model';
import { User } from '../models/user.model';

export async function createIndexes(): Promise<void> {
  const logger = new Logger('DatabaseIndexes');

  try {
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ status: 1 });
    await User.collection.createIndex({ roles: 1 });

    // HealthData indexes
    await HealthData.collection.createIndex({ userId: 1, type: 1 });
    await HealthData.collection.createIndex({ timestamp: -1 });
    await HealthData.collection.createIndex({ 'metrics.name': 1 });

    // Profile indexes
    await Profile.collection.createIndex({ userId: 1 }, { unique: true });
    await Profile.collection.createIndex({ healthScore: -1 });
    await Profile.collection.createIndex({ tags: 1 });

    // Notification indexes
    await Notification.collection.createIndex({ userId: 1, read: 1 });
    await Notification.collection.createIndex({ createdAt: -1 });
    await Notification.collection.createIndex({ type: 1 });

    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.error('Failed to create database indexes', error);
    throw error;
  }
}
