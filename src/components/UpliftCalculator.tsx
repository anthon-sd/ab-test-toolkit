import { useState, useCallback, useEffect } from 'react';
import { TrendingUp, Download } from 'lucide-react';
import { analyzeKPIData } from '../utils/statsCalculations';
import { generateUpliftPDF } from '../utils/pdfGenerator';
import { KPIData } from '../types/stats';
import { trackUpliftCalculation, trackPDFDownload } from '../utils/gtm';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import HelpButton from './HelpButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StdDevMultipliers {
  conservative: number;
  moderate: number;
  aggressive: number;
}

interface Uplifts {
  conservative: number;
  moderate: number;
  aggressive: number;
}

export default function UpliftCalculator() {
  const [rawData, setRawData] = useState<string>('');
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [uplifts, setUplifts] = useState<Uplifts | null>(null);
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const [stdDevMultipliers, setStdDevMultipliers] = useState<StdDevMultipliers>({
    conservative: 0.5,
    moderate: 1.0,
    aggressive: 1.5
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateResults = useCallback(() => {
    setIsCalculating(true);
    try {
      const values = rawData
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          // Remove % sign if present and convert to decimal
          const value = parseFloat(line.replace('%', '')) / 100;
          return isNaN(value) ? null : value;
        })
        .filter((num): num is number => num !== null);

      if (values.length >= 2) {
        const data = analyzeKPIData(values);

        setKpiData(data);

        if (data.mean !== null && data.standardDeviation !== null) {
          const calculatedUplifts = {
            conservative: stdDevMultipliers.conservative * data.standardDeviation / data.mean,
            moderate: stdDevMultipliers.moderate * data.standardDeviation / data.mean,
            aggressive: stdDevMultipliers.aggressive * data.standardDeviation / data.mean
          };
          setUplifts(calculatedUplifts);
          trackUpliftCalculation(data, calculatedUplifts);
        } else {
          setUplifts(null);
        }
      } else {
        setKpiData(null);
        setUplifts(null);
      }
    } catch (error) {
      setKpiData(null);
      setUplifts(null);
    } finally {
      setIsCalculating(false);
    }
  }, [rawData, stdDevMultipliers]);

  const handleMultiplierChange = (type: keyof StdDevMultipliers, value: string) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue >= 0) {
      const newMultipliers = { ...stdDevMultipliers, [type]: newValue };
      setStdDevMultipliers(newMultipliers);
      
      if (kpiData?.mean !== null && kpiData?.standardDeviation !== null) {
        const newUplifts = {
          conservative: kpiData ? newMultipliers.conservative * kpiData.standardDeviation / kpiData.mean : 0,
          moderate: kpiData ? newMultipliers.moderate * kpiData.standardDeviation / kpiData.mean : 0,
          aggressive: kpiData ? newMultipliers.aggressive * kpiData.standardDeviation / kpiData.mean : 0
        };
        setUplifts(newUplifts);
        trackUpliftCalculation(kpiData, newUplifts);
      }
    }
  };

  useEffect(() => {
    if (!kpiData || !uplifts || kpiData.mean === null || kpiData.standardDeviation === null) return;

    const labels = Array.from(
      { length: kpiData.values.length }, 
      (_, i) => `Data Point ${i + 1}`
    );
    
    const mean = kpiData.mean;
    const targets = {
      conservative: mean * (1 + uplifts.conservative),
      moderate: mean * (1 + uplifts.moderate),
      aggressive: mean * (1 + uplifts.aggressive)
    };

    setChartData({
      labels,
      datasets: [
        {
          label: 'Historical Data',
          data: kpiData.values.map(v => v * 100), // Convert to percentage
          borderColor: '#000000',
          backgroundColor: '#000000',
          pointRadius: 3,
          borderWidth: 1.5,
          tension: 0.4,
        },
        {
          label: 'Mean',
          data: Array(kpiData.values.length).fill(mean * 100), // Convert to percentage
          borderColor: '#004f80',
          backgroundColor: '#004f80',
          borderWidth: 1.5,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'Conservative Target',
          data: Array(kpiData.values.length).fill(targets.conservative * 100), // Convert to percentage
          borderColor: '#67cc34',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          backgroundColor: '#67cc34',
          fill: false,
        },
        {
          label: 'Moderate Target',
          data: Array(kpiData.values.length).fill(targets.moderate * 100), // Convert to percentage
          borderColor: '#ffaa0c',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          backgroundColor: '#ffaa0c',
          fill: false,
        },
        {
          label: 'Aggressive Target',
          data: Array(kpiData.values.length).fill(targets.aggressive * 100), // Convert to percentage
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          borderColor: '#e8506e',
          backgroundColor: '#e8506e',
          fill: false,
        },
      ],
    });
  }, [kpiData, uplifts]);

  const formatValue = (value: number): string => 
    `${(value * 100).toFixed(2)}%`;

  const formatUplift = (uplift: number): string => 
    `${(uplift * 100).toFixed(1)}%`;

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false
      },
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        titleFont: {
          size: 13,
          weight: 'bold',
          family: "'Poppins', sans-serif"
        },
        bodyColor: 'white',
        bodyFont: {
          size: 12,
          family: "'Poppins', sans-serif"
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          title: function(tooltipItems: TooltipItem<'line'>[]) {
            return tooltipItems[0].label;
          },
          label: function(context: TooltipItem<'line'>) {
            const label = context.dataset.label || '';
            const value = Number(context.parsed.y);
            let displayValue = `${value.toFixed(2)}%`;

            if (label.includes('Target') && kpiData?.mean !== null) {
              const upliftPercentage = kpiData ? ((value - (kpiData.mean * 100)) / (kpiData.mean * 100) * 100).toFixed(1) : '0';
              displayValue += ` (+${upliftPercentage}%)`;
            }

            return `${label}: ${displayValue}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            return `${Number(value).toFixed(1)}%`;
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        backgroundColor: 'white',
        min: kpiData?.mean !== null && kpiData?.standardDeviation !== null 
          ? Math.max(0, kpiData ? (kpiData.mean - 3 * kpiData.standardDeviation) * 100 : 0) 
          : 0,
        max: kpiData?.mean !== null && kpiData?.standardDeviation !== null 
          ? kpiData ? (kpiData.mean + 3 * kpiData.standardDeviation) * 100 : undefined
          : undefined,
        suggestedMin: 0
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        backgroundColor: 'white'
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    hover: {
      mode: 'nearest',
      intersect: false
    }
  };

  const handleDownloadPDF = () => {
    if (!kpiData || !uplifts || kpiData.mean === null || kpiData.standardDeviation === null) return;
    const pdf = generateUpliftPDF(kpiData, uplifts);
    pdf.save('uplift-analysis.pdf');
    trackPDFDownload('uplift', {
      metric_type: 'conversion',
      data_points: kpiData.values.length,
      mean: kpiData.mean,
      std_dev: kpiData.standardDeviation,
      conservative_uplift: uplifts.conservative,
      moderate_uplift: uplifts.moderate,
      aggressive_uplift: uplifts.aggressive
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Uplift Calculator</h3>
        </div>
        <HelpButton
          title="How to Calculate Uplift Targets"
          content="This calculator helps you determine realistic uplift targets for your A/B tests based on historical data. Enter your historical KPI values (one per line) and adjust the standard deviation multipliers to set conservative, moderate, and aggressive targets. The calculator will analyze your data and provide uplift targets that account for natural variation in your metrics."
          calculatorType="Uplift Calculator"
        />
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Enter Historical KPI Values (one per line)
            </label>
            <HelpButton
              title="Understanding Historical Data"
              content="Enter your historical KPI values, with one value per line. These should be percentage values (e.g., 2.5%) for conversion rates or actual values (e.g., 25.50) for continuous metrics. The calculator will analyze this data to understand the natural variation in your metric and help set realistic uplift targets. More data points will provide more accurate results."
              calculatorType="Historical Data"
            />
          </div>
          <textarea
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={5}
            placeholder="Enter values (one per line)&#10;Example:&#10;2.5%&#10;3.1%&#10;2.8%"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stdDevMultipliers).map(([type, value]) => (
            <div key={type} className="flex flex-col">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {type} Multiplier
                </label>
                <HelpButton
                  title={`Understanding ${type} Multiplier`}
                  content={`The ${type} multiplier determines how many standard deviations above the mean to set your target. A higher multiplier means a more ambitious target. ${type} targets are typically used for ${type === 'conservative' ? 'minimum viable improvements' : type === 'moderate' ? 'balanced improvements' : 'ambitious improvements'}.`}
                  calculatorType={`${type} Multiplier`}
                />
              </div>
              <input
                type="number"
                min="0"
                step="0.1"
                value={value}
                onChange={(e) => handleMultiplierChange(type as keyof StdDevMultipliers, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {kpiData && uplifts && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold text-blue-900">Analysis Results</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-blue-700">
                      Mean: {kpiData.mean !== null ? formatValue(kpiData.mean) : 'N/A'}
                    </p>
                    <p className="text-sm text-blue-700">
                      Standard Deviation: {kpiData.standardDeviation !== null ? formatValue(kpiData.standardDeviation) : 'N/A'}
                    </p>
                  </div>
                </div>
                <HelpButton
                  title="Understanding Analysis Results"
                  content="The mean represents the average value of your historical data, while the standard deviation shows how much variation exists in your data. These metrics help determine realistic uplift targets. Higher standard deviation means more natural variation in your metric, which may require larger sample sizes to detect changes."
                  calculatorType="Analysis Results"
                />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold text-green-900">Uplift Targets</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-green-700">
                      Conservative: {formatUplift(uplifts.conservative)}
                    </p>
                    <p className="text-sm text-green-700">
                      Moderate: {formatUplift(uplifts.moderate)}
                    </p>
                    <p className="text-sm text-green-700">
                      Aggressive: {formatUplift(uplifts.aggressive)}
                    </p>
                  </div>
                </div>
                <HelpButton
                  title="Understanding Uplift Targets"
                  content="These are your calculated uplift targets based on your historical data and chosen multipliers. Conservative targets are more achievable but may not justify the test investment. Aggressive targets are more ambitious but may require larger sample sizes. Moderate targets offer a balance between feasibility and impact."
                  calculatorType="Uplift Targets"
                />
              </div>
            </div>

            {chartData && (
              <div className="h-80">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Historical Data Visualization</h4>
                  <HelpButton
                    title="Understanding the Chart"
                    content="This chart visualizes your historical data (black dots), the mean (blue dashed line), and your uplift targets (colored dashed lines). The targets show what your metric would need to achieve to reach each uplift level. Use this visualization to understand the scale of improvement needed for each target."
                    calculatorType="Data Visualization"
                  />
                </div>
                <Line data={chartData} options={chartOptions} />
              </div>
            )}

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
    </div>
  );
}