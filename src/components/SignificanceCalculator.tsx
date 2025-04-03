import { useState, useEffect } from 'react';
import { BarChart, Download } from 'lucide-react';
import { calculateSignificance } from '../utils/statsCalculations';
import { generateSignificancePDF } from '../utils/pdfGenerator';
import { TestResults, StatisticalResults } from '../types/stats';
import { trackSignificanceCalculation, trackPDFDownload } from '../utils/gtm';

export default function SignificanceCalculator() {
  const [metricType, setMetricType] = useState<'conversion' | 'continuous'>('conversion');
  const [results, setResults] = useState<TestResults>({
    metricType: 'conversion',
    controlGroup: { size: '', conversions: '' },
    treatmentGroup: { size: '', conversions: '' }
  });
  
  const isValidInput = metricType === 'conversion' 
    ? Boolean(results.controlGroup.size && results.controlGroup.conversions && 
              results.treatmentGroup.size && results.treatmentGroup.conversions)
    : Boolean(results.controlGroup.size && results.controlGroup.mean && results.controlGroup.stdDev && 
              results.treatmentGroup.size && results.treatmentGroup.mean && results.treatmentGroup.stdDev);

  const stats: StatisticalResults | null = isValidInput 
    ? calculateSignificance({
        ...results,
        controlGroup: {
          ...results.controlGroup,
          size: Number(results.controlGroup.size),
          conversions: results.controlGroup.conversions ? Number(results.controlGroup.conversions) : undefined,
          mean: results.controlGroup.mean ? Number(results.controlGroup.mean) : undefined,
          stdDev: results.controlGroup.stdDev ? Number(results.controlGroup.stdDev) : undefined
        },
        treatmentGroup: {
          ...results.treatmentGroup,
          size: Number(results.treatmentGroup.size),
          conversions: results.treatmentGroup.conversions ? Number(results.treatmentGroup.conversions) : undefined,
          mean: results.treatmentGroup.mean ? Number(results.treatmentGroup.mean) : undefined,
          stdDev: results.treatmentGroup.stdDev ? Number(results.treatmentGroup.stdDev) : undefined
        }
      })
    : null;

  // Determine the winning group
  const getWinningGroup = () => {
    if (!stats || !stats.significant) return null;
    
    if (metricType === 'conversion') {
      const controlRate = Number(results.controlGroup.conversions) / Number(results.controlGroup.size);
      const treatmentRate = Number(results.treatmentGroup.conversions) / Number(results.treatmentGroup.size);
      return treatmentRate > controlRate ? 'treatment' : 'control';
    } else {
      const controlMean = Number(results.controlGroup.mean);
      const treatmentMean = Number(results.treatmentGroup.mean);
      return treatmentMean > controlMean ? 'treatment' : 'control';
    }
  };

  const winningGroup = getWinningGroup();

  useEffect(() => {
    if (isValidInput && stats) {
      trackSignificanceCalculation(results, stats);
    }
  }, [results, stats, isValidInput]);

  const formatValue = (value: number) => {
    if (metricType === 'conversion') {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toFixed(2);
  };

  const formatChange = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const handleControlInput = (field: string, value: string) => {
    setResults(prev => ({
      ...prev,
      metricType,
      controlGroup: { ...prev.controlGroup, [field]: value }
    }));
  };

  const handleTreatmentInput = (field: string, value: string) => {
    setResults(prev => ({
      ...prev,
      metricType,
      treatmentGroup: { ...prev.treatmentGroup, [field]: value }
    }));
  };

  const handleDownloadPDF = () => {
    if (isValidInput && stats) {
      const pdf = generateSignificancePDF(results, stats);
      pdf.save('significance-test-results.pdf');
      
      trackPDFDownload('significance', {
        metric_type: results.metricType,
        control_group: {
          size: results.controlGroup.size,
          conversions: results.controlGroup.conversions,
          mean: results.controlGroup.mean,
          std_dev: results.controlGroup.stdDev
        },
        treatment_group: {
          size: results.treatmentGroup.size,
          conversions: results.treatmentGroup.conversions,
          mean: results.treatmentGroup.mean,
          std_dev: results.treatmentGroup.stdDev
        },
        results: {
          p_value: stats.pValue,
          relative_uplift: stats.relativeUplift,
          absolute_change: stats.absoluteChange,
          significant: stats.significant
        }
      });
    }
  };

  const getGroupStyles = (group: 'control' | 'treatment') => {
    if (!stats?.significant || !winningGroup) {
      return 'bg-gray-50';
    }
    if (winningGroup === group) {
      return winningGroup === 'control'
        ? 'bg-red-50 border-2 border-red-500 shadow-md'
        : 'bg-green-50 border-2 border-green-500 shadow-md';
    }
    return 'bg-gray-50 opacity-75';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold">Statistical Significance Calculator</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Metric Type
        </label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={metricType}
          onChange={(e) => {
            const newType = e.target.value as 'conversion' | 'continuous';
            setMetricType(newType);
            setResults({
              metricType: newType,
              controlGroup: newType === 'conversion'
                ? { size: '', conversions: '' }
                : { size: '', mean: '', stdDev: '' },
              treatmentGroup: newType === 'conversion'
                ? { size: '', conversions: '' }
                : { size: '', mean: '', stdDev: '' }
            });
          }}
        >
          <option value="conversion">Conversion Rate (%)</option>
          <option value="continuous">Continuous Value (LTV, AOV)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-lg p-6 transition-all duration-300 ${getGroupStyles('control')}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Control Group</h3>
            {winningGroup === 'control' && stats?.significant && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Winner</span>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sample Size</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={results.controlGroup.size}
                onChange={(e) => handleControlInput('size', e.target.value)}
                placeholder="e.g., 1000"
              />
            </div>
            {metricType === 'conversion' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">Conversions</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={results.controlGroup.conversions}
                  onChange={(e) => handleControlInput('conversions', e.target.value)}
                  placeholder="e.g., 100"
                />
                {results.controlGroup.size && results.controlGroup.conversions && (
                  <p className="mt-1 text-sm text-gray-500">
                    Rate: {((Number(results.controlGroup.conversions) / Number(results.controlGroup.size)) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mean Value</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={results.controlGroup.mean}
                    onChange={(e) => handleControlInput('mean', e.target.value)}
                    placeholder="e.g., 25.50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Standard Deviation</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={results.controlGroup.stdDev}
                    onChange={(e) => handleControlInput('stdDev', e.target.value)}
                    placeholder="e.g., 5.0"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className={`rounded-lg p-6 transition-all duration-300 ${getGroupStyles('treatment')}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Treatment Group</h3>
            {winningGroup === 'treatment' && stats?.significant && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Winner</span>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sample Size</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={results.treatmentGroup.size}
                onChange={(e) => handleTreatmentInput('size', e.target.value)}
                placeholder="e.g., 1000"
              />
            </div>
            {metricType === 'conversion' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">Conversions</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={results.treatmentGroup.conversions}
                  onChange={(e) => handleTreatmentInput('conversions', e.target.value)}
                  placeholder="e.g., 120"
                />
                {results.treatmentGroup.size && results.treatmentGroup.conversions && (
                  <p className="mt-1 text-sm text-gray-500">
                    Rate: {((Number(results.treatmentGroup.conversions) / Number(results.treatmentGroup.size)) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mean Value</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={results.treatmentGroup.mean}
                    onChange={(e) => handleTreatmentInput('mean', e.target.value)}
                    placeholder="e.g., 27.30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Standard Deviation</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={results.treatmentGroup.stdDev}
                    onChange={(e) => handleTreatmentInput('stdDev', e.target.value)}
                    placeholder="e.g., 5.2"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isValidInput && stats && (
        <div className="mt-8 space-y-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Results (PDF)
            </button>
          </div>
          
          <div className={`p-6 rounded-lg ${
            stats.significant 
              ? winningGroup === 'control'
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Results</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Relative Change</p>
                <p className={`text-xl font-bold ${
                  stats.significant
                    ? winningGroup === 'control'
                      ? 'text-red-600'
                      : 'text-green-600'
                    : stats.relativeUplift >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatChange(stats.relativeUplift)}
                </p>
              </div>
              {stats.absoluteChange !== undefined && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Absolute Change</p>
                  <p className={`text-xl font-bold ${
                    stats.significant
                      ? winningGroup === 'control'
                        ? 'text-red-600'
                        : 'text-green-600'
                      : stats.absoluteChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatValue(stats.absoluteChange)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">P-Value</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.pValue.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Confidence Level</p>
                <p className="text-xl font-bold text-gray-900">
                  {((1 - stats.pValue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${
              stats.significant
                ? winningGroup === 'control'
                  ? 'bg-red-100'
                  : 'bg-green-100'
                : 'bg-yellow-100'
            }`}>
              <p className="text-sm font-medium">
                {stats.significant 
                  ? `✅ The results are statistically significant at the 95% confidence level. The ${winningGroup} group performed better with a ${formatChange(Math.abs(stats.relativeUplift))} ${stats.relativeUplift >= 0 ? 'increase' : 'decrease'}.`
                  : "⚠️ The results are not statistically significant at the 95% confidence level. Consider running the test longer or increasing sample size."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}