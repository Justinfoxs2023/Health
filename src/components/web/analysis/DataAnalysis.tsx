import React, { useState, useEffect } from 'react';

import { TrendAnalysis, CorrelationMatrix, PredictionChart, InsightPanel } from './components';
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
    if (loading) return <div></div>;

    switch (analysisType) {
      case 'trend':
        return <TrendAnalysis data={results.trends} config={config.trend} />;
      case 'correlation':
        return <CorrelationMatrix data={results.correlations} config={config.correlation} />;
      case 'prediction':
        return <PredictionChart data={results.predictions} config={config.prediction} />;
      case 'insight':
        return <InsightPanel insights={results.insights} config={config.insight} />;
      default:
        return null;
    }
  };

  return (
    <div className="data-analysis">
      <div className="analysis-controls">
        <select value={analysisType} onChange={e => setAnalysisType(e.target.value)}>
          <option value="trend"></option>
          <option value="correlation"></option>
          <option value="prediction"></option>
          <option value="insight"></option>
        </select>
      </div>

      <div className="analysiscontent">{renderAnalysis}</div>

      <div className="analysis-summary">
        {results?.summary && (
          <div className="summary-card">
            <h3></h3>
            <p>{resultssummarydescription}</p>
            <ul>
              {results.summary.keyPoints.map(point => (
                <li key={pointid}>{pointtext}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
