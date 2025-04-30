import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatDuration } from '../utils/formatting';
import HelpButton from './HelpButton';

interface RuntimeCalculatorProps {
  requiredSampleSize: number | null;
}

export default function RuntimeCalculator({ requiredSampleSize }: RuntimeCalculatorProps) {
  const [dailyTraffic, setDailyTraffic] = useState<number>(1000);
  const [testDuration, setTestDuration] = useState<string>('');

  const calculateTestDuration = () => {
    if (!requiredSampleSize || dailyTraffic <= 0) {
      setTestDuration('');
      return;
    }

    const days = Math.ceil(requiredSampleSize / dailyTraffic);
    setTestDuration(formatDuration(days));
  };

  useEffect(() => {
    calculateTestDuration();
  }, [requiredSampleSize, dailyTraffic]);

  const handleDailyTrafficChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setDailyTraffic(0);
    } else {
      const parsedValue = parseInt(value);
      if (!isNaN(parsedValue)) {
        setDailyTraffic(parsedValue);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Test Duration Calculator</h3>
        </div>
        <HelpButton
          title="How to Calculate A/B Test Duration"
          content="Use this calculator to estimate how long your A/B test needs to run based on your daily traffic. Enter your expected daily number of users, and the calculator will determine the minimum duration needed to reach your required sample size."
          calculatorType="Test Duration Calculator"
        />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Daily Traffic
            </label>
            <HelpButton
              title="Understanding Daily Traffic"
              content="Enter the average number of users you expect to see per day. This should be based on historical data or realistic projections. The calculator uses this number to determine how many days are needed to reach your required sample size."
              calculatorType="Daily Traffic"
            />
          </div>
          <input
            type="number"
            min="1"
            value={dailyTraffic || ''}
            onChange={handleDailyTrafficChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {testDuration && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold text-blue-900">
                  Estimated Test Duration
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {testDuration}
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Based on {dailyTraffic.toLocaleString()} daily users
                </p>
              </div>
              <HelpButton
                title="Understanding Test Duration Results"
                content="The calculated duration represents the minimum time needed to reach your required sample size. This is based on your daily traffic and the sample size from the previous calculator. Remember that longer tests can help account for weekly patterns and seasonal variations in user behavior."
                calculatorType="Test Duration Results"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}