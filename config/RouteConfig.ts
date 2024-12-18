import { lazy } from 'react';

// 页面组件懒加载
const HealthMonitor = lazy(() => import('@/pages/health-monitor/HealthMonitor'));
const Consultation = lazy(() => import('@/pages/consultation/Consultation'));
const ChronicManagement = lazy(() => import('@/pages/chronic/ChronicManagement'));
const NutritionManagement = lazy(() => import('@/pages/nutrition/NutritionManagement'));

export const routeConfig = {
  mainEntries: {
    healthMonitor: {
      path: '/health-monitor',
      component: HealthMonitor,
      preload: true,
      subRoutes: [
        { path: '/vitals', component: lazy(() => import('@/pages/health-monitor/VitalsDisplay')) },
        { path: '/metrics', component: lazy(() => import('@/pages/health-monitor/HealthMetrics')) },
        { path: '/alerts', component: lazy(() => import('@/pages/health-monitor/AlertPanel')) },
      ],
    },
    consultation: {
      path: '/consultation',
      component: Consultation,
      subRoutes: [
        { path: '/doctors', component: lazy(() => import('@/pages/consultation/DoctorList')) },
        { path: '/video-chat', component: lazy(() => import('@/pages/consultation/VideoChat')) },
        {
          path: '/prescription',
          component: lazy(() => import('@/pages/consultation/Prescription')),
        },
      ],
    },
    chronicManagement: {
      path: '/chronic-management',
      component: ChronicManagement,
      subRoutes: [
        { path: '/tracking', component: lazy(() => import('@/pages/chronic/DiseaseTracking')) },
        {
          path: '/medication',
          component: lazy(() => import('@/pages/chronic/MedicationReminder')),
        },
        { path: '/lifestyle', component: lazy(() => import('@/pages/chronic/LifestyleGuide')) },
      ],
    },
    nutritionManagement: {
      path: '/nutrition',
      component: NutritionManagement,
      subRoutes: [
        { path: '/diet-analysis', component: lazy(() => import('@/pages/nutrition/DietAnalysis')) },
        { path: '/meal-planning', component: lazy(() => import('@/pages/nutrition/MealPlanning')) },
        {
          path: '/nutrition-advice',
          component: lazy(() => import('@/pages/nutrition/NutritionAdvice')),
        },
      ],
    },
  },
};
