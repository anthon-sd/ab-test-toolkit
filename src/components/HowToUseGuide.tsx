import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { trackAccordionOpen } from '../utils/gtm';

export default function HowToUseGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    trackAccordionOpen('how-to-use', newState);
  };

  return (
    <div className="bg-[#004f80] rounded-lg shadow-lg text-white">
      <button
        onClick={handleToggle}
        className="w-full p-8 flex items-center justify-between hover:bg-[#0d2d52] transition-colors duration-150 ease-in-out"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#ffaa0c]" />
          <h2 className="text-xl font-bold">How to Use the A/B Test Stats Toolkit</h2>
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
        <div className="p-8 pt-0 space-y-8">
          <section>
            <h3 className="text-2xl font-bold text-[#ffaa0c] mb-4">Step 1 - Estimate a Realistic Uplift</h3>
            <p className="text-white mb-3">
              <span className="text-[#ffaa0c]">📊</span> Use the KPI Uplift Calculator to analyze past KPI data and estimate a realistic target uplift based on standard deviation methodology.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#ffaa0c]">✅</span>
                <span>This helps you avoid setting targets that are too aggressive or statistically improbable.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffaa0c]">✅</span>
                <span>Compare your expected uplift against historical trends to ensure feasibility before running a test.</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-[#ffaa0c] mb-4">Step 2 -Calculate Your Sample Size</h3>
            <p className="text-white mb-3">
              <span className="text-[#ffaa0c]">📏</span> Use the Sample Size Calculator to determine the number of users required in each variant (A & B) for valid results.
            </p>
            <div className="bg-[#0d2d52] p-4 rounded-lg mb-4">
              <h4 className="text-[#ffaa0c] font-medium mb-2">The tool accounts for:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#ffaa0c]">📌</span>
                  <span>Confidence Level – The probability that your test results are not due to random chance (commonly set at 95%).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffaa0c]">📌</span>
                  <span>Statistical Power – The likelihood that your test correctly detects a real uplift (usually set at 80%).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffaa0c]">📌</span>
                  <span>Expected Uplift & Baseline Metric – These factors determine the minimum sample size needed to achieve statistical significance.</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#0d2d52] p-4 rounded-lg">
              <h4 className="text-[#ffaa0c] font-medium mb-2">Why this matters:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#ffaa0c]">✅</span>
                  <span>Ensures your test has enough players for reliable conclusions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffaa0c]">✅</span>
                  <span>Helps avoid false positives and negatives due to small sample sizes.</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-[#ffaa0c] mb-4">Step 3 -Run Your A/B Test</h3>
            <p className="text-white mb-3">
              <span className="text-[#ffaa0c]">📢</span> Launch your A/B test and monitor the results:
            </p>
            <div className="bg-[#0d2d52] p-4 rounded-lg mb-4">
              <p className="mb-2">Control Group (A) – Current Experience.</p>
              <p>Variant Group (B) – New Experience.</p>
            </div>
            <p className="flex items-start gap-2 mb-3">
              <span className="text-[#ffaa0c]">🕒</span>
              <span>Run the test until a sufficient sample size is reached to ensure statistical validity.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#ffaa0c]">⚠️</span>
              <span className="font-medium">Important: Avoid stopping a test early just because results look promising—it can lead to misleading conclusions.</span>
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-[#ffaa0c] mb-4">Step 4 -Analyze Your Results</h3>
            <p className="text-white mb-3">
              <span className="text-[#ffaa0c]">📊</span> Use the Statistical Significance Calculator to determine if your test results are meaningful.
            </p>
            <div className="bg-[#0d2d52] p-4 rounded-lg mb-4">
              <h4 className="text-[#ffaa0c] font-medium mb-2">The tool applies a frequentist approach and considers your:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#ffaa0c]">📌</span>
                  <span>P-value – Measures whether the observed difference is statistically significant or just due to random chance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffaa0c]">📌</span>
                  <span>Confidence Intervals – Provides a range where the true uplift likely falls, helping you assess the test's reliability.</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#0d2d52] p-4 rounded-lg">
              <h4 className="text-[#ffaa0c] font-medium mb-2">How to interpret results:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#ffaa0c]">✅</span>
                  <span>P-value &lt; 0.05? Your uplift is statistically significant, meaning you can confidently roll out the change.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffaa0c]">✅</span>
                  <span>P-value &gt; 0.05? The test results are inconclusive—consider gathering more data or refining your test.</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-[#ffaa0c] mb-4">Best Practices for Reliable A/B Tests</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#ffaa0c]">✅</span>
                <span>Run tests for a sufficient duration – Avoid premature conclusions by ensuring enough data collection.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffaa0c]">✅</span>
                <span>Test one variable at a time – This isolates the true cause of any observed uplift.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffaa0c]">✅</span>
                <span>Monitor external factors – Seasonal events, major updates, or promotions can skew test results.</span>
              </li>
            </ul>
          </section>

          <p className="text-white mt-6">
            By following these steps, you'll make data-driven decisions that enhance player engagement, retention, and monetization with statistical confidence. <span className="text-[#ffaa0c]">🚀</span>
          </p>
        </div>
      </div>
    </div>
  );
}