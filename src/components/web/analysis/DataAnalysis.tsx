import React, { useState, useEffect } from 'react';
import { 
  TrendAnalysis,
  CorrelationMatrix,
  PredictionChart,
  InsightPanel 
} from './components';
import { useDataAnalysis } from '../../../hooks/useDataAnalysis';

export const DataAnalysis: React.FC<{
  data: any;
  config: AnalysisConfig;
}> = ({ data, config }) => {
  const [analysisType, setAnalysisType] = useState('trend');
  const { results, loading, analyze } = useDataAnalysis();

  useEffect(() => {
    analyze(data, analysisType, config);
  }, [data, analysisType, config]);

  const renderAnalysis = () => {
    if (loading) return <div>分析中...</div>;

    switch (analysisType) {
      case 'trend':
        return (
          <TrendAnalysis 
            data={results.trends}
            config={config.trend}
          />
        );
      case 'correlation':
        return (
          <CorrelationMatrix 
            data={results.correlations}
            config={config.correlation}
          />
        );
      case 'prediction':
        return (
          <PredictionChart 
            data={results.predictions}
            config={config.prediction}
          />
        );
      case 'insight':
        return (
          <InsightPanel 
            insights={results.insights}
            config={config.insight}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="data-analysis">
      <div className="analysis-controls">
        <select 
          value={analysisType}
          onChange={e => setAnalysisType(e.target.value)}
        >
          <option value="trend">趋势分析</option>
          <option value="correlation">相关性分析</option>
          <option value="prediction">预测分析</option>
          <option value="insight">数据洞察</option>
        </select>
      </div>

      <div className="analysis-content">
        {renderAnalysis()}
      </div>

      <div className="analysis-summary">
        {results?.summary && (
          <div className="summary-card">
            <h3>分析总结</h3>
            <p>{results.summary.description}</p>
            <ul>
              {results.summary.keyPoints.map(point => (
                <li key={point.id}>{point.text}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 