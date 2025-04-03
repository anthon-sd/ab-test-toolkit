import { useState } from 'react';
import { Info } from 'lucide-react';

interface VolatilityModelInfoProps {
  selectedModel: 'sample' | 'population' | 'moving' | 'exponential';
}

export default function VolatilityModelInfo({ selectedModel }: VolatilityModelInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
      >
        <Info className="w-5 h-5 mr-1" />
        <span className="text-sm font-medium">Which Volatility Model Should You Choose?</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-[600px] bg-white rounded-lg shadow-xl border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">Understanding Volatility Models</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            
            <p className="text-sm text-gray-600">
              Standard deviation measures how much your KPI values typically spread out from the average (mean). 
              A higher value means more volatility. Choose the model that best reflects your data and what you want to understand:
            </p>

            <div className="space-y-4">
              <div className={`p-3 rounded-md ${selectedModel === 'sample' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                <h4 className="font-medium text-gray-900">1. Sample</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Calculates volatility assuming your data is a sample representing a larger overall trend. This is the most common statistical approach.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Best For:</strong> General-purpose analysis of KPI variability. Provides a good overall estimate of volatility 
                  based on the data you have. If unsure, start here.
                </p>
              </div>

              <div className={`p-3 rounded-md ${selectedModel === 'population' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                <h4 className="font-medium text-gray-900">2. Population</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Calculates volatility assuming your data represents the entire, complete picture. 
                  Every possible value is included in your dataset.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Best For:</strong> Situations where your data is truly exhaustive (e.g., analysing test scores for every 
                  student in a single, specific class). This is rare for most business KPIs.
                </p>
              </div>

              <div className={`p-3 rounded-md ${selectedModel === 'moving' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                <h4 className="font-medium text-gray-900">3. Moving</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Focuses only on recent performance. Calculates volatility using a fixed number (windowSize) 
                  of the most recent data points (e.g., the last 7 days). Older data is ignored completely.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Best For:</strong> Understanding current volatility and stability, especially if market conditions or 
                  performance change frequently. Helps answer: "How volatile has this KPI been lately?" Adjust windowSize to define "lately".
                </p>
              </div>

              <div className={`p-3 rounded-md ${selectedModel === 'exponential' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                <h4 className="font-medium text-gray-900">4. Exponential</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Also focuses on recent performance but gives gradually decreasing importance to older data points, 
                  rather than cutting them off abruptly like the 'Moving' model. Recent data matters most, but history still has some 
                  (diminishing) influence. Uses a smoothing factor (alpha).
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Best For:</strong> Tracking trends in volatility smoothly. Good when you believe recent performance is more 
                  predictive, but you don't want sudden jumps caused by dropping older data entirely. Provides a balance between 
                  responsiveness and stability. Adjust alpha to control sensitivity to recent changes (higher alpha = more reactive).
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              <strong>In short:</strong> Use Sample for general analysis, Moving for current volatility focus, Exponential for a smoother 
              view of recent volatility trends, and Population only if your data is fully complete.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 