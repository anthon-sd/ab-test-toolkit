import { useState } from 'react';
import { Calculator, Download } from 'lucide-react';
import { calculateRequiredSampleSize } from '../utils/statsCalculations';
import { generateSampleSizePDF } from '../utils/pdfGenerator';
import { TestParameters } from '../types/stats';
import { trackSampleSizeCalculation, trackPDFDownload } from '../utils/gtm';
import RuntimeCalculator from './RuntimeCalculator';
import HelpButton from './HelpButton';

export default function SampleSizeCalculator() {
  const [params, setParams] = useState<TestParameters>({
    kpiType: 'conversion',
    baselineRate: '',
    expectedUplift: '',
    confidenceLevel: 0.95,
    power: 0.8
  });

  const isValidInput = params.baselineRate !== '' && params.expectedUplift !== '';

  const calculationParams = isValidInput ? {
    ...params,
    baselineRate: Number(params.baselineRate) / 100,
    expectedUplift: Number(params.expectedUplift) / 100
  } : null;

  const sampleSize = calculationParams ? calculateRequiredSampleSize(calculationParams) : null;
  const isPercentageMetric = params.kpiType === 'conversion' || params.kpiType === 'retention';

  const handleNumberInput = (field: keyof TestParameters, value: string) => {
    const newParams = {
      ...params,
      [field]: value === '' ? '' : parseFloat(value)
    };
    setParams(newParams);
    
    if (newParams.baselineRate !== '' && newParams.expectedUplift !== '') {
      // Track the calculation only when we have valid input
      trackSampleSizeCalculation(newParams, calculateRequiredSampleSize({
        ...newParams,
        baselineRate: Number(newParams.baselineRate) / 100,
        expectedUplift: Number(newParams.expectedUplift) / 100
      }));
    }
  };

  const handleDownloadPDF = () => {
    if (calculationParams && sampleSize) {
      const pdf = generateSampleSizePDF(calculationParams, sampleSize);
      pdf.save('sample-size-results.pdf');
      
      // Track PDF download with detailed data
      trackPDFDownload('sample_size', {
        kpi_type: params.kpiType,
        baseline_rate: calculationParams.baselineRate,
        expected_uplift: calculationParams.expectedUplift,
        confidence_level: calculationParams.confidenceLevel,
        power: calculationParams.power,
        required_sample_size: sampleSize
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold">Sample Size Calculator</h2>
          </div>
          <HelpButton
            title="How to Calculate A/B Test Sample Size"
            content="Use this calculator to determine the minimum number of users needed for your experiment. Input your baseline conversion rate, minimum detectable effect (MDE), and desired confidence level. The calculator uses statistical power analysis to ensure your test has enough participants to detect meaningful differences between variants. A larger sample size is needed for smaller expected uplifts or when you need higher confidence in your results."
            calculatorType="Sample Size Calculator"
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">KPI Type</label>
              <HelpButton
                title="Understanding KPI Types"
                content="Select the type of metric you're testing: Conversion (percentage-based), Retention (percentage-based), LTV (numeric value), or Average Transaction Value (numeric value). This affects how the calculator interprets your inputs."
                calculatorType="KPI Type"
              />
            </div>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={params.kpiType}
              onChange={(e) => setParams({ ...params, kpiType: e.target.value as TestParameters['kpiType'] })}
            >
              <option value="retention">D-n Retention</option>
              <option value="ltv">LTV-n</option>
              <option value="conversion">Conversion</option>
              <option value="atv">Average Transaction Value</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Baseline Rate {isPercentageMetric ? '(%)' : '(current value)'}
              </label>
              <HelpButton
                title="Baseline Rate Explanation"
                content="Enter your current conversion rate or metric value. For percentage-based metrics (conversion, retention), enter as a percentage (e.g., 10.5 for 10.5%). For numeric metrics (LTV, ATV), enter the actual value."
                calculatorType="Baseline Rate"
              />
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              max={isPercentageMetric ? "100" : undefined}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={params.baselineRate.toString()}
              onChange={(e) => handleNumberInput('baselineRate', e.target.value)}
              placeholder={isPercentageMetric ? "e.g., 10.55" : "e.g., 25.50"}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Expected Uplift {isPercentageMetric ? '(%)' : '(as decimal)'}
              </label>
              <HelpButton
                title="Expected Uplift Guide"
                content="Enter the minimum improvement you want to detect. For percentage-based metrics, enter as a percentage (e.g., 5 for 5% improvement). For numeric metrics, enter as a decimal (e.g., 0.05 for 5% improvement)."
                calculatorType="Expected Uplift"
              />
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              max={isPercentageMetric ? "100" : undefined}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={params.expectedUplift.toString()}
              onChange={(e) => handleNumberInput('expectedUplift', e.target.value)}
              placeholder={isPercentageMetric ? "e.g., 5.25" : "e.g., 0.0525"}
            />
          </div>

          {isValidInput && sampleSize !== null && (
            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Required Sample Size</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {sampleSize.toLocaleString()} users per variant
                  </p>
                  <p className="text-sm text-blue-700 mt-2">
                    This calculation assumes a 95% confidence level and 80% statistical power
                  </p>
                </div>
                <HelpButton
                  title="Understanding Sample Size Results"
                  content="The calculated sample size represents the minimum number of users needed per variant to detect your specified uplift with 95% confidence and 80% statistical power. This means there's a 95% chance the results are not due to random chance, and an 80% chance of detecting the uplift if it exists."
                  calculatorType="Sample Size Results"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Results (PDF)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Runtime Calculator */}
      <RuntimeCalculator requiredSampleSize={sampleSize} />
    </div>
  );
}