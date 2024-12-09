import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller';
import { auth } from '../middleware/auth';

const router = Router();

// 创建预约
router.post('/', auth.required, appointmentController.createAppointment);

// 获取预约列表
router.get('/', auth.required, appointmentController.getAppointments);

// 更新预约状态
router.put('/:id/status', auth.required, appointmentController.updateAppointmentStatus);

// 添加咨询记录(营养师)
router.put('/:id/consultation', auth.nutritionistRequired, appointmentController.addConsultationRecord);

// 评价预约(用户)
router.put('/:id/rate', auth.required, appointmentController.rateAppointment);

export default router; 