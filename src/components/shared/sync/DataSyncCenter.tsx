import React, { useState, useEffect } from 'react';

import {
  SyncStatus,
  SyncHistory,
  SyncSettings,
  ConflictResolver,
  DataDiff,
  SyncProgress,
} from './components';
import { useDataSync } from '../../../hooks/useDataSync';

export 
const DataSyncCenter: React.FC = () => {
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
        <h2></h2>
        <div className="sync-controls">
          <label>
            <input
              type="checkbox"
              checked={autoSync}
              onChange={e => setAutoSync(e.target.checked)}
            />
            自动同步
          </label>
          <button onClick={operationssyncNow} disabled={syncStateisSyncing}>
            
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
          <SyncProgress progress={syncState.progress} currentTask={syncState.currentTask} />
        )}

        {syncState.conflicts.length > 0 && (
          <ConflictResolver
            conflicts={syncState.conflicts}
            onResolve={operations.resolveConflict}
          />
        )}

        <div className="sync-details">
          <div className="sync-panel">
            <h3></h3>
            <SyncHistory history={syncState.history} onAction={operations.handleHistoryAction} />
          </div>

          <div className="sync-panel">
            <h3></h3>
            <DataDiff diffs={syncState.diffs} onAction={operations.handleDiffAction} />
          </div>
        </div>

        <div className="sync-settings">
          <SyncSettings settings={syncState.settings} onUpdate={operations.updateSettings} />
        </div>
      </div>

      <style jsx>{
        synccenter {
          padding 20px
        }

        syncheader {
          display flex
          justifycontent spacebetween
          alignitems center
          marginbottom 20px
        }

        synccontrols {
          display flex
          gap 15px
          alignitems center
        }

        synccontent {
          display flex
          flexdirection column
          gap 20px
        }

        syncdetails {
          display grid
          gridtemplatecolumns 1fr 1fr
          gap 20px
        }

        syncpanel {
          background fff
          borderradius 8px
          padding 15px
          boxshadow 0 2px 4px rgba0 0 0 01
        }
      }</style>
    </div>
  );
};
