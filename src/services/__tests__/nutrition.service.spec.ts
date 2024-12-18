import { NutritionService } from '../nutrition.service';
import { Test } from '@nestjs/testing';
import { generateMockNutritionData } from '@test/utils/test-helpers';

describe('NutritionService', () => {
  let service: NutritionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NutritionService],
    }).compile();

    service = module.get<NutritionService>(NutritionService);
  });

  it('analyze meal correctly', async () => {
    const mockData = generateMockNutritionData();
    const result = await service.analyzeMeal('user123', mockData);
    expect(result).toBeDefined();
  });
});
