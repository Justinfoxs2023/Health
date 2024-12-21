import mongoose from 'mongoose';
import { Logger } from '../utils/logger';
import { config } from '../config';

export class DatabaseConnection {
  private logger: Logger;
  private static instance: DatabaseConnection;

  private constructor() {
    this.logger = new Logger('DatabaseConnection');
    this.setupMongoose();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private setupMongoose() {
    mongoose.connection.on('connected', () => {
      this.logger.info('MongoDB connected');
    });

    mongoose.connection.on('error', err => {
      this.logger.error('MongoDB connection error', err);
    });

    mongoose.connection.on('disconnected', () => {
      this.logger.warn('MongoDB disconnected');
    });

    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        this.logger.info('MongoDB disconnected through app termination');
        process.exit(0);
      });
    });
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(config.mongodb.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.logger.info('MongoDB disconnected');
    } catch (error) {
      this.logger.error('Failed to disconnect from MongoDB', error);
      throw error;
    }
  }
}
