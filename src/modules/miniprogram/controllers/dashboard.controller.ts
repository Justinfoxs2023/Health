import { ComponentService } from '../services/component.service';
import { Controller, Get } from '@nestjs/common';
import { PerformanceService } from '../services/performance.service';

@Controller()
export class DashboardController {
  constructor(
    private readonly componentService: ComponentService,
    private readonly performanceService: PerformanceService,
  ) {}

  @Get()
  async getDashboardOverview() {
    const components = await this.componentService.getAllComponents();
    const activeCount = components.filter(c => c.status === 'active').length;

    return {
      totalComponents: components.length,
      activeComponents: activeCount,
      deprecatedComponents: components.filter(c => c.status === 'deprecated').length,
      recentUpdates: components.slice(0, 5),
    };
  }
}
