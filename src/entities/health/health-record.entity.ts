import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class HealthRecord {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne() => User)
  user: User;

  @Column()
  userId: string;

  @Column()
  vitalSigns: {
    heartRate?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    bloodSugar?: number;
    temperature?: number;
  };

  @Column()
  exerciseData: {
    type: string;
    duration: number;
    calories: number;
    distance?: number;
    steps?: number;
  };

  @Column()
  dietaryData: {
    meals: Array<{
      type: string;
      foods: Array<{
        name: string;
        portion: number;
        calories: number;
        nutrients: {
          protein: number;
          carbs: number;
          fat: number;
        };
      }>;
    }>;
    totalCalories: number;
    waterIntake: number;
  };

  @Column()
  sleepData: {
    duration: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    startTime: Date;
    endTime: Date;
    phases?: Array<{
      type: string;
      duration: number;
    }>;
  };

  @CreateDateColumn()
  recordedAt: Date;
}
