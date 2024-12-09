import { Container } from 'inversify';
import { TYPES } from './types';
import { 
  LoggerImpl, 
  MetricsImpl, 
  AlertServiceImpl 
} from '../infrastructure';

const container = new Container();

// 注册基础设施服务
container.bind(TYPES.Logger).to(LoggerImpl);
container.bind(TYPES.Metrics).to(MetricsImpl);
container.bind(TYPES.AlertService).to(AlertServiceImpl);

// 注册业务服务
container.bind(TYPES.ExerciseService).to(ExerciseService);
container.bind(TYPES.NutritionService).to(NutritionService);
container.bind(TYPES.PaymentService).to(PaymentService);

export { container }; 