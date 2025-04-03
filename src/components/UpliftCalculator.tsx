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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold">KPI Uplift Calculator</h2>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="data-input" className="text-sm font-medium text-gray-700">
            Enter your historical KPI data here (one value per line). Use weekly data for best results!
          </label>
          <textarea
            id="data-input"
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            className="w-full h-32 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your historical KPI data here..."
          />
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={calculateResults}
            disabled={isCalculating || !rawData.trim()}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isCalculating || !rawData.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isCalculating ? 'Calculating...' : 'Calculate'}
          </button>
        </div>
      </div>

      {kpiData && kpiData.mean !== null && kpiData.standardDeviation !== null && uplifts && (
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Mean</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {kpiData.mean !== null ? formatValue(kpiData.mean) : '0'}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Standard Deviation</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {kpiData.standardDeviation !== null ? formatValue(kpiData.standardDeviation) : '0'}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Data Points</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {kpiData.values.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conservative</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Multiplier:</span>
                    <input
                      type="number"
                      value={stdDevMultipliers.conservative}
                      onChange={(e) => handleMultiplierChange('conservative', e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-right"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Uplift:</span>
                    <span className="text-lg font-bold text-[#67cc34]">{formatUplift(uplifts.conservative)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Target:</span>
                    <span className="text-lg font-bold text-[#67cc34]">
                      {kpiData && kpiData.mean !== null ? formatValue(kpiData.mean * (1 + uplifts.conservative)) : '0'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderate</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Multiplier:</span>
                    <input
                      type="number"
                      value={stdDevMultipliers.moderate}
                      onChange={(e) => handleMultiplierChange('moderate', e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-right"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Uplift:</span>
                    <span className="text-lg font-bold text-[#ffaa0c]">{formatUplift(uplifts.moderate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Target:</span>
                    <span className="text-lg font-bold text-[#ffaa0c]">
                      {kpiData && kpiData.mean !== null ? formatValue(kpiData.mean * (1 + uplifts.moderate)) : '0'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aggressive</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Multiplier:</span>
                    <input
                      type="number"
                      value={stdDevMultipliers.aggressive}
                      onChange={(e) => handleMultiplierChange('aggressive', e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-right"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Uplift:</span>
                    <span className="text-lg font-bold text-[#e8506e]">{formatUplift(uplifts.aggressive)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Target:</span>
                    <span className="text-lg font-bold text-[#e8506e]">
                      {kpiData && kpiData.mean !== null ? formatValue(kpiData.mean * (1 + uplifts.aggressive)) : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {chartData && (
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="h-[400px]">
                  <Line data={chartData} options={chartOptions} />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}