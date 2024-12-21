import { HealthRecord } from '../entities/health/health-record.entity';
import { HealthRecordService } from './health-record.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('HealthRecordService', () => {
  let service: HealthRecordService;
  let repository: Repository<HealthRecord>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthRecordService,
        {
          provide: getRepositoryToken(HealthRecord),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<HealthRecordService>(HealthRecordService);
    repository = module.get<Repository<HealthRecord>>(getRepositoryToken(HealthRecord));
  });

  it('be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createHealthRecord', () => {
    it('create a health record', async () => {
      const mockRecord = {
        userId: '1',
        vitalSigns: {
          heartRate: 75,
          bloodPressure: {
            systolic: 120,
            diastolic: 80,
          },
        },
        exerciseData: {
          type: 'running',
          duration: 30,
          calories: 300,
        },
        dietaryData: {
          meals: [],
          totalCalories: 0,
          waterIntake: 2000,
        },
        sleepData: {
          duration: 8,
          quality: 'good',
          startTime: new Date(),
          endTime: new Date(),
        },
      };

      mockRepository.save.mockResolvedValue(mockRecord);

      const result = await service.createHealthRecord(mockRecord);
      expect(result).toEqual(mockRecord);
      expect(mockRepository.save).toHaveBeenCalledWith(mockRecord);
    });
  });

  describe('getHealthRecords', () => {
    it('return health records for a user', async () => {
      const mockRecords = [
        {
          id: '1',
          userId: '1',
          vitalSigns: {},
          exerciseData: {},
          dietaryData: {},
          sleepData: {},
        },
      ];

      mockRepository.find.mockResolvedValue(mockRecords);

      const result = await service.getHealthRecords('1');
      expect(result).toEqual(mockRecords);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: '1' },
        order: { recordedAt: 'DESC' },
      });
    });
  });
});
