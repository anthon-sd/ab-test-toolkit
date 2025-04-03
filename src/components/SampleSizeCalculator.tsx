import { useState } from 'react';
import { Calculator, Download } from 'lucide-react';
import { calculateRequiredSampleSize } from '../utils/statsCalculations';
import { generateSampleSizePDF } from '../utils/pdfGenerator';
import { TestParameters } from '../types/stats';
import { trackSampleSizeCalculation, trackPDFDownload } from '../utils/gtm';
import RuntimeCalculator from './RuntimeCalculator';

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
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">Sample Size Calculator</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">KPI Type</label>
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
            <label className="block text-sm font-medium text-gray-700">
              Baseline Rate {isPercentageMetric ? '(%)' : '(current value)'}
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max={isPercentageMetric ? "100" : undefined}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={params.baselineRate.toString()}
              onChange={(e) => handleNumberInput('baselineRate', e.target.value)}
              placeholder={isPercentageMetric ? "e.g., 10" : "e.g., 25.50"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expected Uplift {isPercentageMetric ? '(%)' : '(as decimal)'}
            </label>
            <input
              type="number"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={params.expectedUplift.toString()}
              onChange={(e) => handleNumberInput('expectedUplift', e.target.value)}
              placeholder={isPercentageMetric ? "e.g., 5" : "e.g., 0.05"}
            />
          </div>

          {isValidInput && sampleSize !== null && (
            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Results (PDF)
                </button>
              </div>
              <h3 className="text-lg font-semibold text-blue-900">Required Sample Size</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {sampleSize.toLocaleString()} users per variant
              </p>
              <p className="text-sm text-blue-700 mt-2">
                This calculation assumes a 95% confidence level and 80% statistical power
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Runtime Calculator */}
      <RuntimeCalculator requiredSampleSize={sampleSize} />
    </div>
  );
}