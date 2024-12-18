import React, { useState } from 'react';

import { TaskList, TaskEditor, TaskMonitor, TaskLogs, TaskStats, TaskCalendar } from './components';
import { useTaskScheduler } from '../../../hooks/useTaskScheduler';

export const TaskScheduler: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const { tasks, operations, stats, loading } = useTaskScheduler();

  return (
    <div className="task-scheduler">
      <div className="scheduler-header">
        <h2></h2>
        <div className="scheduler-stats">
          <div className="stat-item">
            <span></span>
            <strong>{statstotalTasks}</strong>
          </div>
          <div className="stat-item">
            <span></span>
            <strong>{statsrunningTasks}</strong>
          </div>
          <div className="stat-item">
            <span></span>
            <strong>{statspendingTasks}</strong>
          </div>
          <div className="stat-item">
            <span></span>
            <strong>{statsfailedTasks}</strong>
          </div>
        </div>
      </div>

      <div className="scheduler-container">
        <div className="task-list-panel">
          <TaskList
            tasks={tasks}
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
            onTaskAction={operations.handleTaskAction}
          />
        </div>

        <div className="task-detail-panel">
          {selectedTask ? (
            <TaskEditor
              task={selectedTask}
              onSave={operations.handleTaskSave}
              onDelete={operations.handleTaskDelete}
            />
          ) : (
            <div className="notaskselected"></div>
          )}
        </div>

        <div className="task-monitor-panel">
          <TaskMonitor tasks={tasks} onTaskAction={operations.handleTaskAction} />
        </div>
      </div>

      <div className="scheduler-bottom">
        <div className="task-logs">
          <TaskLogs logs={tasks.logs} onLogAction={operations.handleLogAction} />
        </div>
        <div className="task-stats">
          <TaskStats stats={stats} onStatAction={operations.handleStatAction} />
        </div>
        <div className="task-calendar">
          <TaskCalendar tasks={tasks} onCalendarAction={operations.handleCalendarAction} />
        </div>
      </div>
    </div>
  );
};
