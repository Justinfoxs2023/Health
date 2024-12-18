import { BaseService } from '../base.service';

import { TestFactory } from '@/__tests__/helpers/test-factory';

class TestService extends BaseService {
  constructor() {
    super('TestService');
  }

  async testMethod() {
    return 'test';
  }
}

describe('BaseService', () => {
  let service: TestService;
  let mockLogger: jest.SpyInstance;

  beforeEach(() => {
    service = new TestService();
    mockLogger = jest.spyOn(TestFactory.createTestLogger(), 'error');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handle errors correctly', async () => {
    const error = new Error('Test error');
    await expect(service.handleError(error, 'Test context')).rejects.toThrow(error);
    expect(mockLogger).toHaveBeenCalledWith('Service error', {
      error,
      context: 'Test context',
    });
  });
});
