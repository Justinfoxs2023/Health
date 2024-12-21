import React, { useState } from 'react';

import {
  DataExplorer,
  QueryBuilder,
  ChartBuilder,
  ReportGenerator,
  DataComparison,
  PredictiveModel,
} from './components';
import { useAnalysisTools } from '../../../hooks/useAnalysisTools';

export 
const AnalysisTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState('explorer');
  const { data, tools, operations } = useAnalysisTools();

  return (
    <div className="analysis-tools">
      <div className="tools-header">
        <h2></h2>
        <div className="tool-actions">
          <button onClick={operationshandleExport}></button>
          <button onClick={operationshandleShare}></button>
          <button onClick={operationshandleSave}></button>
        </div>
      </div>

      <div className="tools-container">
        <div className="tools-sidebar">
          <div className="tool-nav">
            <button
              className={activeTool === explorer  active  }
              onClick={ => setActiveToolexplorer}
            >
              
            </button>
            <button
              className={activeTool === query  active  }
              onClick={ => setActiveToolquery}
            >
              
            </button>
            <button
              className={activeTool === chart  active  }
              onClick={ => setActiveToolchart}
            >
              
            </button>
            <button
              className={activeTool === report  active  }
              onClick={ => setActiveToolreport}
            >
              
            </button>
            <button
              className={activeTool === comparison  active  }
              onClick={ => setActiveToolcomparison}
            >
              
            </button>
            <button
              className={activeTool === prediction  active  }
              onClick={ => setActiveToolprediction}
            >
              
            </button>
          </div>
        </div>

        <div className="tools-content">
          {activeTool === 'explorer' && (
            <DataExplorer
              data={data.explorerData}
              tools={tools.explorer}
              onAction={operations.handleExplorerAction}
            />
          )}
          {activeTool === 'query' && (
            <QueryBuilder
              data={data.queryData}
              tools={tools.query}
              onAction={operations.handleQueryAction}
            />
          )}
          {activeTool === 'chart' && (
            <ChartBuilder
              data={data.chartData}
              tools={tools.chart}
              onAction={operations.handleChartAction}
            />
          )}
          {activeTool === 'report' && (
            <ReportGenerator
              data={data.reportData}
              tools={tools.report}
              onAction={operations.handleReportAction}
            />
          )}
          {activeTool === 'comparison' && (
            <DataComparison
              data={data.comparisonData}
              tools={tools.comparison}
              onAction={operations.handleComparisonAction}
            />
          )}
          {activeTool === 'prediction' && (
            <PredictiveModel
              data={data.predictionData}
              tools={tools.prediction}
              onAction={operations.handlePredictionAction}
            />
          )}
        </div>
      </div>

      <style jsx>{
        analysistools {
          display flex
          flexdirection column
          height 100
        }

        toolscontainer {
          display flex
          flex 1
          gap 20px
        }

        toolssidebar {
          width 200px
          background f5f5f5
          padding 20px
        }

        toolscontent {
          flex 1
          padding 20px
          background fff
          borderradius 8px
        }

        toolnav {
          display flex
          flexdirection column
          gap 10px
        }

        toolnav button {
          textalign left
          padding 10px
          border none
          background none
          borderradius 4px
        }

        toolnav buttonactive {
          background e0e0e0
          fontweight bold
        }

        toolactions {
          display flex
          gap 10px
        }
      }</style>
    </div>
  );
};
