import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { trackAccordionOpen } from '../utils/gtm';

export default function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    trackAccordionOpen('about', newState);
  };

  return (
    <div className="bg-[#004f80] rounded-lg shadow-lg text-white">
      <button
        onClick={handleToggle}
        className="w-full p-8 flex items-center justify-between hover:bg-[#0d2d52] transition-colors duration-150 ease-in-out"
      >
        <div className="flex items-center gap-2">
          <Info className="w-6 h-6 text-[#ffaa0c]" />
          <h2 className="text-xl font-bold">Solidify Your Optimisations With Statistics</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-white" />
        ) : (
          <ChevronDown className="w-6 h-6 text-white" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-8 pt-0">
          <div className="prose max-w-none space-y-6">
            <p className="text-lg text-white">
              This A/B Test Stats Toolkit is designed for game studios looking to optimize player engagement, retention, and monetization through rigorous experimentation. Whether you're testing new game mechanics, in-game economy tweaks, or LiveOps strategies, our toolkit provides the statistical insights you need to drive meaningful improvements.
            </p>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Key Features:</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-[#0d2d52] p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-[#ffaa0c] mb-2">
                    ✅ KPI Uplift Calculator
                  </h4>
                  <p className="text-white">
                    Set realistic uplift targets based on historical KPI data using standard deviation methodology.
                  </p>
                </div>
                <div className="bg-[#0d2d52] p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-[#ffaa0c] mb-2">
                    ✅ Sample Size Calculator
                  </h4>
                  <p className="text-white">
                    Determine the optimal number of users per variant to detect meaningful uplifts with statistical confidence.
                  </p>
                </div>
                <div className="bg-[#0d2d52] p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-[#ffaa0c] mb-2">
                    ✅ Significance Calculator
                  </h4>
                  <p className="text-white">
                    Evaluate A/B test results using the frequentist approach, a robust and accurate method for determining statistical significance.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Built for Game Studios</h3>
              <p className="text-white">
                This toolkit is tailored for game studio business KPIs, including:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                <li className="flex flex-col gap-2 bg-[#0d2d52] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎮</span>
                    <span className="font-semibold text-[#ffaa0c]">Daily Active Users (DAU)</span>
                  </div>
                  <span className="text-white">
                    Track how feature changes affect player engagement and retention.</span>
                </li>
                <li className="flex flex-col gap-2 bg-[#0d2d52] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <span className="font-semibold text-[#ffaa0c]">Session Duration</span>
                  </div>
                  <span className="text-white">
                    Measure the impact of gameplay changes on time spent in-game.</span>
                </li>
                <li className="flex flex-col gap-2 bg-[#0d2d52] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <span className="font-semibold text-[#ffaa0c]">Retention (D1, D7, D30)</span>
                  </div>
                  <span className="text-white">
                    Identify game mechanics that boost player stickiness.</span>
                </li>
                <li className="flex flex-col gap-2 bg-[#0d2d52] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    <span className="font-semibold text-[#ffaa0c]">Lifetime Value (LTV)</span>
                  </div>
                  <span className="text-white">
                    Assess how pricing or monetization changes impact revenue per player.</span>
                </li>
                <li className="flex flex-col gap-2 bg-[#0d2d52] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛒</span>
                    <span className="font-semibold text-[#ffaa0c]">Conversion Rates</span>
                  </div>
                  <span className="text-white">
                    Test new offers, store layouts, and purchase funnels with clarity.</span>
                </li>
                <li className="flex flex-col gap-2 bg-[#0d2d52] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💵</span>
                    <span className="font-semibold text-[#ffaa0c]">Average Transaction Value (ATV)</span>
                  </div>
                  <span className="text-white">
                    Optimize IAPs (in-app purchases) and pricing strategies for better ARPU.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Why Use This Toolkit?</h3>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 list-none pl-0">
                <li className="flex flex-col gap-2 bg-[#0d2d52] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎮</span>
                    <span className="font-semibold text-[#ffaa0c]">Tailored for Game KPIs</span>
                  </div>
                  <span className="text-white">
                    Designed by experts who understand game analytics.</span>
                </li>
                <li className="flex flex-col gap-2 bg-[#0d2d52] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <span className="font-semibold text-[#ffaa0c]">Fast & Easy Calculations</span>
                  </div>
                  <span className="text-white">
                    Get instant results without needing a statistics background.</span>
                </li>
                <li className="flex flex-col gap-2 bg-[#0d2d52] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛠️</span>
                    <span className="font-semibold text-[#ffaa0c]">Actionable Insights</span>
                  </div>
                  <span className="text-white">
                    Take the guesswork out of decision-making and drive data-backed improvements.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}