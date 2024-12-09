export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>健康管理中心</h1>
        <div className="quick-actions">
          <Button>预约咨询</Button>
          <Button>查看报告</Button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* 健康概览 */}
        <HealthSummaryCard 
          metrics={healthMetrics}
          onViewDetail={handleViewDetail}
        />

        {/* 待办事项 */}
        <UpcomingEventsList 
          events={upcomingEvents}
          onEventClick={handleEventClick}
        />

        {/* 最近活动 */}
        <RecentActivityFeed 
          activities={recentActivities}
          onActivityClick={handleActivityClick}
        />

        {/* 健康指标 */}
        <HealthMetricsChart 
          data={healthData}
          onPeriodChange={handlePeriodChange}
        />
      </div>
    </div>
  );
}; 