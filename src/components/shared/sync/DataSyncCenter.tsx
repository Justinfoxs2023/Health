import React, { useState, useEffect } from 'react';
import {
  SyncStatus,
  SyncHistory,
  SyncSettings,
  ConflictResolver,
  DataDiff,
  SyncProgress
} from './components';
import { useDataSync } from '../../../hooks/useDataSync';

export const DataSyncCenter: React.FC = () => {
  const [autoSync, setAutoSync] = useState(true);
  const { syncState, operations } = useDataSync();

  useEffect(() => {
    if (autoSync) {
      operations.startAutoSync();
    }
    return () => operations.stopAutoSync();
  }, [autoSync]);

  return (
    <div className="sync-center">
      <div className="sync-header">
        <h2>数据同步中心</h2>
        <div className="sync-controls">
          <label>
            <input
              type="checkbox"
              checked={autoSync}
              onChange={e => setAutoSync(e.target.checked)}
            />
            自动同步
          </label>
          <button 
            onClick={operations.syncNow}
            disabled={syncState.isSyncing}
          >
            立即同步
          </button>
        </div>
      </div>

      <div className="sync-content">
        <div className="sync-status">
          <SyncStatus 
            status={syncState.status}
            lastSync={syncState.lastSync}
            nextSync={syncState.nextSync}
          />
        </div>

        {syncState.isSyncing && (
          <SyncProgress 
            progress={syncState.progress}
            currentTask={syncState.currentTask}
          />
        )}

        {syncState.conflicts.length > 0 && (
          <ConflictResolver 
            conflicts={syncState.conflicts}
            onResolve={operations.resolveConflict}
          />
        )}

        <div className="sync-details">
          <div className="sync-panel">
            <h3>同步历史</h3>
            <SyncHistory 
              history={syncState.history}
              onAction={operations.handleHistoryAction}
            />
          </div>

          <div className="sync-panel">
            <h3>数据差异</h3>
            <DataDiff 
              diffs={syncState.diffs}
              onAction={operations.handleDiffAction}
            />
          </div>
        </div>

        <div className="sync-settings">
          <SyncSettings 
            settings={syncState.settings}
            onUpdate={operations.updateSettings}
          />
        </div>
      </div>

      <style jsx>{`
        .sync-center {
          padding: 20px;
        }

        .sync-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .sync-controls {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .sync-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sync-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .sync-panel {
          background: #fff;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}; 