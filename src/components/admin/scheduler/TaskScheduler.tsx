import React, { useState } from 'react';
import {
  TaskList,
  TaskEditor,
  TaskMonitor,
  TaskLogs,
  TaskStats,
  TaskCalendar
} from './components';
import { useTaskScheduler } from '../../../hooks/useTaskScheduler';

export const TaskScheduler: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const { tasks, operations, stats, loading } = useTaskScheduler();

  return (
    <div className="task-scheduler">
      <div className="scheduler-header">
        <h2>任务调度</h2>
        <div className="scheduler-stats">
          <div className="stat-item">
            <span>总任务数</span>
            <strong>{stats.totalTasks}</strong>
          </div>
          <div className="stat-item">
            <span>运行中</span>
            <strong>{stats.runningTasks}</strong>
          </div>
          <div className="stat-item">
            <span>等待中</span>
            <strong>{stats.pendingTasks}</strong>
          </div>
          <div className="stat-item">
            <span>失败</span>
            <strong>{stats.failedTasks}</strong>
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
            <div className="no-task-selected">
              请选择或创建一个任务
            </div>
          )}
        </div>

        <div className="task-monitor-panel">
          <TaskMonitor 
            tasks={tasks}
            onTaskAction={operations.handleTaskAction}
          />
        </div>
      </div>

      <div className="scheduler-bottom">
        <div className="task-logs">
          <TaskLogs 
            logs={tasks.logs}
            onLogAction={operations.handleLogAction}
          />
        </div>
        <div className="task-stats">
          <TaskStats 
            stats={stats}
            onStatAction={operations.handleStatAction}
          />
        </div>
        <div className="task-calendar">
          <TaskCalendar 
            tasks={tasks}
            onCalendarAction={operations.handleCalendarAction}
          />
        </div>
      </div>
    </div>
  );
}; 