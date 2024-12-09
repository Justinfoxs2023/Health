import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingState } from '@/components/common/LoadingState';

// 懒加载页面组件
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const MemberCenter = lazy(() => import('@/pages/MemberCenter'));
const ConsultationHub = lazy(() => import('@/pages/ConsultationHub'));
const CommunitySpace = lazy(() => import('@/pages/CommunitySpace'));
const HealthRecords = lazy(() => import('@/pages/HealthRecords'));
const Settings = lazy(() => import('@/pages/Settings'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/member/*" element={<MemberCenter />} />
        <Route path="/consultation/*" element={<ConsultationHub />} />
        <Route path="/community/*" element={<CommunitySpace />} />
        <Route path="/health-records/*" element={<HealthRecords />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}; 