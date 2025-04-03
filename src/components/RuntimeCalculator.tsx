import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { TestParameters } from '../types/stats';
import { trackRuntimeCalculation, trackRuntimeInputChange, trackSplitRatioChange } from '../utils/gtm';

interface RuntimeCalculatorProps {
  requiredSampleSize: number | null;
}

export default function RuntimeCalculator({ requiredSampleSize }: RuntimeCalculatorProps) {
  const [dailyTraffic, setDailyTraffic] = useState<string>('');
  const [splitRatio, setSplitRatio] = useState<string>('50');
  const [runtimeDetails, setRuntimeDetails] = useState<{
    days: number;
    weeks: number;
    months: number;
  } | null>(null);

  useEffect(() => {
    if (requiredSampleSize && dailyTraffic && splitRatio) {
      const traffic = parseFloat(dailyTraffic);
      const ratio = parseFloat(splitRatio) / 100;
      
      if (!isNaN(traffic) && !isNaN(ratio) && traffic > 0 && ratio > 0) {
        const dailyVariantTraffic = traffic * ratio;
        const totalDays = Math.ceil(requiredSampleSize / dailyVariantTraffic);
        
        const details = {
          days: totalDays,
          weeks: Math.ceil(totalDays / 7),
          months: Math.ceil(totalDays / 30)
        };
        
        setRuntimeDetails(details);
        
        // Track calculation
        trackRuntimeCalculation({
          required_sample_size: requiredSampleSize,
          daily_traffic: traffic,
          split_ratio: ratio,
          estimated_days: totalDays
        });
      }
    }
  }, [requiredSampleSize, dailyTraffic, splitRatio]);

  const handleDailyTrafficChange = (value: string) => {
    setDailyTraffic(value);
    trackRuntimeInputChange('daily_traffic', value, {
      splitRatio,
      requiredSampleSize
    });
  };

  const handleSplitRatioChange = (value: string) => {
    setSplitRatio(value);
    trackSplitRatioChange(value, dailyTraffic, requiredSampleSize || 0);
  };

  if (!requiredSampleSize) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold">Runtime Calculator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Average Daily Traffic
          </label>
          <input
            type="number"
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={dailyTraffic}
            onChange={(e) => handleDailyTrafficChange(e.target.value)}
            placeholder="e.g., 1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Traffic Split Ratio (%)
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={splitRatio}
            onChange={(e) => handleSplitRatioChange(e.target.value)}
          >
            <option value="50">50/50 split</option>
            <option value="20">20/80 split</option>
            <option value="10">10/90 split</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Percentage of traffic allocated to each variant
          </p>
        </div>

        {runtimeDetails && (
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Estimated Runtime</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Days</p>
                <p className="text-2xl font-bold text-blue-600">{runtimeDetails.days}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Weeks</p>
                <p className="text-2xl font-bold text-blue-600">{runtimeDetails.weeks}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Months</p>
                <p className="text-2xl font-bold text-blue-600">{runtimeDetails.months}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-blue-700">
              Based on {dailyTraffic} daily visitors with a {splitRatio}/{100-parseInt(splitRatio)} split
            </p>
          </div>
        )}
      </div>
    </div>
  );
}