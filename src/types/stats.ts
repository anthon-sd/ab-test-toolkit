export interface TestParameters {
  kpiType: 'retention' | 'ltv' | 'conversion' | 'atv';
  baselineRate: number | string;
  expectedUplift: number | string;
  confidenceLevel: number;
  power: number;
}

export interface TestResults {
  metricType: 'conversion' | 'continuous';
  controlGroup: {
    size: number | string;
    conversions?: number | string;
    mean?: number | string;
    stdDev?: number | string;
    values?: number[];
  };
  treatmentGroup: {
    size: number | string;
    conversions?: number | string;
    mean?: number | string;
    stdDev?: number | string;
    values?: number[];
  };
}

export interface StatisticalResults {
  pValue: number;
  confidenceInterval: [number, number];
  relativeUplift: number;
  absoluteChange?: number;
  significant: boolean;
  bayesFactor?: number;
  effectSize?: number;
}

export interface KPIData {
  values: number[];        // The original input values
  mean: number | null;     // The calculated mean (null if calculation is not possible)
  standardDeviation: number | null; // The calculated standard deviation (null if not possible)
  stdDevModelUsed: 'population' | 'sample' | 'moving' | 'exponential' | 'none'; // Which model was actually used
  errorMessage?: string; // Optional error message if calculation failed
}