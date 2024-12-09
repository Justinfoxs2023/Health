import React, { useState } from 'react';
import {
  DataExplorer,
  QueryBuilder,
  ChartBuilder,
  ReportGenerator,
  DataComparison,
  PredictiveModel
} from './components';
import { useAnalysisTools } from '../../../hooks/useAnalysisTools';

export const AnalysisTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState('explorer');
  const { data, tools, operations } = useAnalysisTools();

  return (
    <div className="analysis-tools">
      <div className="tools-header">
        <h2>数据分析工具</h2>
        <div className="tool-actions">
          <button onClick={operations.handleExport}>导出分析</button>
          <button onClick={operations.handleShare}>分享分析</button>
          <button onClick={operations.handleSave}>保存分析</button>
        </div>
      </div>

      <div className="tools-container">
        <div className="tools-sidebar">
          <div className="tool-nav">
            <button 
              className={activeTool === 'explorer' ? 'active' : ''}
              onClick={() => setActiveTool('explorer')}
            >
              数据探索
            </button>
            <button 
              className={activeTool === 'query' ? 'active' : ''}
              onClick={() => setActiveTool('query')}
            >
              查询构建
            </button>
            <button 
              className={activeTool === 'chart' ? 'active' : ''}
              onClick={() => setActiveTool('chart')}
            >
              图表构建
            </button>
            <button 
              className={activeTool === 'report' ? 'active' : ''}
              onClick={() => setActiveTool('report')}
            >
              报告生成
            </button>
            <button 
              className={activeTool === 'comparison' ? 'active' : ''}
              onClick={() => setActiveTool('comparison')}
            >
              数据对比
            </button>
            <button 
              className={activeTool === 'prediction' ? 'active' : ''}
              onClick={() => setActiveTool('prediction')}
            >
              预测模型
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

      <style jsx>{`
        .analysis-tools {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .tools-container {
          display: flex;
          flex: 1;
          gap: 20px;
        }

        .tools-sidebar {
          width: 200px;
          background: #f5f5f5;
          padding: 20px;
        }

        .tools-content {
          flex: 1;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
        }

        .tool-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .tool-nav button {
          text-align: left;
          padding: 10px;
          border: none;
          background: none;
          border-radius: 4px;
        }

        .tool-nav button.active {
          background: #e0e0e0;
          font-weight: bold;
        }

        .tool-actions {
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}; 