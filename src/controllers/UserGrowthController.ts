import { Controller } from '@nestjs/common';
import { UserGrowthService } from '../services/UserGrowthService';

@Controller('user-growth')
export class UserGrowthController {
  constructor(private readonly userGrowthService: UserGrowthService) {}

  // 用户成长相关的控制器方法
} 