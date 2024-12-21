import React, { useState } from 'react';

import {
  ReportBuilder,
  ReportViewer,
  ReportScheduler,
  ReportTemplate,
  ReportDistributor,
  ReportArchive,
} from './components';
import { useReportManagement } from '../../../hooks/useReportManagement';

export 
const ReportManager: React.FC = () => {
  const [activeSection, setActiveSection] = useState('builder');
  const { reports, templates, operations, loading } = useReportManagement();

  const renderSection = () => {
    switch (activeSection) {
      case 'builder':
        return <ReportBuilder templates={templates} onBuild={operations.handleReportBuild} />;
      case 'viewer':
        return <ReportViewer reports={reports} onView={operations.handleReportView} />;
      case 'scheduler':
        return (
          <ReportScheduler
            schedules={reports.schedules}
            onSchedule={operations.handleReportSchedule}
          />
        );
      case 'template':
        return (
          <ReportTemplate templates={templates} onTemplate={operations.handleTemplateAction} />
        );
      case 'distributor':
        return (
          <ReportDistributor
            distribution={reports.distribution}
            onDistribute={operations.handleReportDistribution}
          />
        );
      case 'archive':
        return (
          <ReportArchive archives={reports.archives} onArchive={operations.handleReportArchive} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="report-manager">
      <div className="report-nav">
        <button onClick={ => setActiveSectionbuilder}></button>
        <button onClick={ => setActiveSectionviewer}></button>
        <button onClick={ => setActiveSectionscheduler}></button>
        <button onClick={ => setActiveSectiontemplate}></button>
        <button onClick={ => setActiveSectiondistributor}></button>
        <button onClick={ => setActiveSectionarchive}></button>
      </div>

      <div className="report-content">{loading ? <div></div> : renderSection()}</div>
    </div>
  );
};
