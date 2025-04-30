import { useState, useEffect } from 'react';
import { BarChart, Download } from 'lucide-react';
import { calculateSignificance } from '../utils/statsCalculations';
import { generateSignificancePDF } from '../utils/pdfGenerator';
import { TestResults, StatisticalResults } from '../types/stats';
import { trackSignificanceCalculation, trackPDFDownload } from '../utils/gtm';
import HelpButton from './HelpButton';

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
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Statistical Significance Calculator</h3>
        </div>
        <HelpButton
          title="How to Calculate Statistical Significance"
          content="This calculator helps you determine if the differences between your control and treatment groups are statistically significant. Enter your test data for both groups, and the calculator will analyze the results using appropriate statistical tests. For conversion rates, it uses a two-proportion z-test. For continuous metrics, it uses a two-sample t-test."
          calculatorType="Significance Calculator"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metric Type
          </label>
          <HelpButton
            title="Understanding Metric Types"
            content="Choose between conversion rate (percentage) or continuous value metrics. Conversion rate is for binary outcomes like clicks or purchases. Continuous values are for metrics like revenue, time spent, or order value. The calculator uses different statistical tests based on the metric type you select."
            calculatorType="Metric Type"
          />
        </div>
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
            <div className="flex items-center gap-2">
              {winningGroup === 'control' && stats?.significant && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Winner</span>
              )}
              <HelpButton
                title="Understanding Control Group"
                content="The control group represents your baseline or current experience."
                calculatorType="Control Group"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Sample Size</label>
                <HelpButton
                  title="Understanding Sample Size"
                  content="Enter the total number of users or observations in your control group. Larger sample sizes generally provide more reliable results and can detect smaller differences between groups."
                  calculatorType="Sample Size"
                />
              </div>
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
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Conversions</label>
                  <HelpButton
                    title="Understanding Conversions"
                    content="Enter the number of successful conversions in your control group. This could be purchases, sign-ups, or any other binary outcome you're measuring. The calculator will use this along with the sample size to determine the conversion rate."
                    calculatorType="Conversions"
                  />
                </div>
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
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Mean Value</label>
                    <HelpButton
                      title="Understanding Mean Value"
                      content="Enter the average value for your continuous metric in the control group. This could be average order value, time spent, or any other continuous metric. The mean is used to compare the central tendency between groups."
                      calculatorType="Mean Value"
                    />
                  </div>
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
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Standard Deviation</label>
                    <HelpButton
                      title="Understanding Standard Deviation"
                      content="Enter the standard deviation of your continuous metric in the control group. This measures how spread out the values are around the mean. A higher standard deviation indicates more variability in your data, which may require larger sample sizes to detect significant differences."
                      calculatorType="Standard Deviation"
                    />
                  </div>
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
            <div className="flex items-center gap-2">
              {winningGroup === 'treatment' && stats?.significant && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Winner</span>
              )}
              <HelpButton
                title="Understanding Treatment Group"
                content="The treatment group represents your new or experimental experience."
                calculatorType="Treatment Group"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Sample Size</label>
                <HelpButton
                  title="Understanding Sample Size"
                  content="Enter the total number of users or observations in your treatment group. For valid results, the treatment group should have a similar sample size to the control group. Uneven sample sizes can affect the statistical power of your test."
                  calculatorType="Sample Size"
                />
              </div>
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
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Conversions</label>
                  <HelpButton
                    title="Understanding Conversions"
                    content="Enter the number of successful conversions in your treatment group. Compare this with the control group to see if your changes had a significant impact. Remember that statistical significance depends on both the difference in conversion rates and the sample sizes."
                    calculatorType="Conversions"
                  />
                </div>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={results.treatmentGroup.conversions}
                  onChange={(e) => handleTreatmentInput('conversions', e.target.value)}
                  placeholder="e.g., 100"
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
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Mean Value</label>
                    <HelpButton
                      title="Understanding Mean Value"
                      content="Enter the average value for your continuous metric in the treatment group. The calculator will compare this with the control group's mean to determine if there's a statistically significant difference. Larger differences are easier to detect with smaller sample sizes."
                      calculatorType="Mean Value"
                    />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={results.treatmentGroup.mean}
                    onChange={(e) => handleTreatmentInput('mean', e.target.value)}
                    placeholder="e.g., 25.50"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Standard Deviation</label>
                    <HelpButton
                      title="Understanding Standard Deviation"
                      content="Enter the standard deviation of your continuous metric in the treatment group. This helps the calculator understand the variability in your data. Similar standard deviations between groups make it easier to detect significant differences."
                      calculatorType="Standard Deviation"
                    />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={results.treatmentGroup.stdDev}
                    onChange={(e) => handleTreatmentInput('stdDev', e.target.value)}
                    placeholder="e.g., 5.0"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {stats && (
        <div className="mt-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold text-blue-900">Statistical Results</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-blue-700">
                    p-value: {stats.pValue.toFixed(4)}
                  </p>
                  <p className="text-sm text-blue-700">
                    Relative Uplift: {formatChange(stats.relativeUplift)}
                  </p>
                  <p className="text-sm text-blue-700">
                    Absolute Change: {stats.absoluteChange !== undefined ? formatValue(stats.absoluteChange) : 'N/A'}
                  </p>
                  <p className="text-sm text-blue-700">
                    Significant: {stats.significant ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              <HelpButton
                title="Understanding Statistical Results"
                content="The p-value indicates the probability of observing the results if there was no real difference between groups. A p-value below 0.05 typically indicates statistical significance. The relative uplift shows the percentage improvement, while the absolute change shows the actual difference in the metric. Use these results to make data-driven decisions about your test."
                calculatorType="Statistical Results"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}