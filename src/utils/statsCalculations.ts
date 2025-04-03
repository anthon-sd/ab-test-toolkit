import { TestParameters, TestResults, StatisticalResults, KPIData } from '../types/stats';

export function calculateRequiredSampleSize(params: TestParameters): number {
  const { baselineRate, expectedUplift } = params;
  
  // Z-scores for 95% confidence level and 80% power
  const zAlpha = 1.96;
  const zBeta = 0.84;
  
  const p1 = typeof baselineRate === 'string' ? parseFloat(baselineRate) : baselineRate;
  const p2 = p1 * (1 + (typeof expectedUplift === 'string' ? parseFloat(expectedUplift) : expectedUplift));
  const pBar = (p1 + p2) / 2;
  
  return Math.ceil(
    2 * pBar * (1 - pBar) * Math.pow(zAlpha + zBeta, 2) / Math.pow(p2 - p1, 2)
  );
}

export function calculateSignificance(results: TestResults): StatisticalResults {
  if (results.metricType === 'conversion') {
    return calculateConversionSignificance(results);
  } else {
    return calculateContinuousSignificance(results);
  }
}

function calculateConversionSignificance(results: TestResults): StatisticalResults {
  // Convert all string values to numbers at the start
  const controlSize = Number(results.controlGroup.size) as number;
  const treatmentSize = Number(results.treatmentGroup.size) as number;
  const controlConversions = Number(results.controlGroup.conversions) as number;
  const treatmentConversions = Number(results.treatmentGroup.conversions) as number;
  
  // Calculate rates
  const controlRate = controlConversions / controlSize;
  const treatmentRate = treatmentConversions / treatmentSize;
  const relativeUplift = (treatmentRate - controlRate) / controlRate;
  const absoluteChange = treatmentRate - controlRate;
  
  // Calculate chi-square statistic
  const totalConversions = controlConversions + treatmentConversions;
  const totalSize = controlSize + treatmentSize;
  const expectedControl = totalConversions * (controlSize / totalSize);
  const expectedTreatment = totalConversions * (treatmentSize / totalSize);
  const chiSquare = Math.pow(controlConversions - expectedControl, 2) / expectedControl + 
                    Math.pow(treatmentConversions - expectedTreatment, 2) / expectedTreatment;
  
  // Calculate p-value using chi-square distribution
  const pValue = 1 - chiSquareCDF(chiSquare, 1);
  
  // Calculate confidence interval
  const z = 1.96; // 95% confidence level
  const standardError = Math.sqrt(
    (controlRate * (1 - controlRate) / controlSize) + 
    (treatmentRate * (1 - treatmentRate) / treatmentSize)
  );
  
  return {
    pValue,
    confidenceInterval: [
      absoluteChange - z * standardError,
      absoluteChange + z * standardError
    ],
    relativeUplift,
    absoluteChange,
    significant: pValue < 0.05,
    effectSize: Math.abs(absoluteChange) / Math.sqrt(
      ((controlSize - 1) * controlRate * (1 - controlRate) + 
       (treatmentSize - 1) * treatmentRate * (1 - treatmentRate)) / 
      (controlSize + treatmentSize - 2)
    )
  };
}

function calculateContinuousSignificance(results: TestResults): StatisticalResults {
  // Convert all string values to numbers at the start
  const controlSize = Number(results.controlGroup.size);
  const treatmentSize = Number(results.treatmentGroup.size);
  const controlMean = Number(results.controlGroup.mean);
  const treatmentMean = Number(results.treatmentGroup.mean);
  const controlStdDev = Number(results.controlGroup.stdDev);
  const treatmentStdDev = Number(results.treatmentGroup.stdDev);
  
  // Validate that we have valid numbers
  if (isNaN(controlMean) || isNaN(treatmentMean) || isNaN(controlStdDev) || isNaN(treatmentStdDev)) {
    throw new Error('Invalid numeric values in test results');
  }
  
  const se = Math.sqrt(
    (Math.pow(controlStdDev, 2) / controlSize) +
    (Math.pow(treatmentStdDev, 2) / treatmentSize)
  );
  
  const relativeUplift = (treatmentMean - controlMean) / controlMean;
  const absoluteChange = treatmentMean - controlMean;
  
  const t = absoluteChange / se;
  const df = controlSize + treatmentSize - 2;
  
  const pValue = df > 30 
    ? 2 * (1 - normalCDF(Math.abs(t)))
    : 2 * (1 - studentTCDF(Math.abs(t), df));
  
  return {
    pValue,
    confidenceInterval: [
      relativeUplift - 1.96 * se / controlMean,
      relativeUplift + 1.96 * se / controlMean
    ],
    relativeUplift,
    absoluteChange,
    significant: pValue < 0.05,
    effectSize: absoluteChange / Math.sqrt(
      ((controlSize - 1) * Math.pow(controlStdDev, 2) +
       (treatmentSize - 1) * Math.pow(treatmentStdDev, 2)) /
      (controlSize + treatmentSize - 2)
    )
  };
}

function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  return x > 0 ? 1 - d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
                : d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
}

function studentTCDF(t: number, df: number): number {
  return 1 - betaIncomplete(df/2, 0.5, df/(df + t*t));
}

function betaIncomplete(a: number, b: number, x: number): number {
  if (x < 0 || x > 1) return 0;
  const bt = Math.exp(gammaLn(a + b) - gammaLn(a) - gammaLn(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1)/(a + b + 2) ? bt * betaCF(a, b, x)/a : 1 - bt * betaCF(b, a, 1-x)/b;
}

function betaCF(a: number, b: number, x: number): number {
  let h = 1;
  let c = 1;
  let d = 1 - (a + b) * x / (a + 1);
  
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  h = d;

  for (let m = 1; m <= 100; m++) {
    const m2 = 2 * m;
    const numerator1 = m * (b - m) * x;
    const denominator1 = ((a - 1 + m2) * (a + m2));
    const numerator2 = -(a + m) * (a + b + m) * x;
    const denominator2 = ((a + m2) * (a + 1 + m2));
    
    const term1 = numerator1 / denominator1;
    let nextD = 1 + term1 * d;
    if (Math.abs(nextD) < 1e-30) nextD = 1e-30;
    
    let nextC = 1 + term1 / c;
    if (Math.abs(nextC) < 1e-30) nextC = 1e-30;
    
    d = 1 / nextD;
    c = nextC;
    h *= d * c;
    
    const term2 = numerator2 / denominator2;
    nextD = 1 + term2 * d;
    if (Math.abs(nextD) < 1e-30) nextD = 1e-30;
    
    nextC = 1 + term2 / c;
    if (Math.abs(nextC) < 1e-30) nextC = 1e-30;
    
    d = 1 / nextD;
    c = nextC;
    const del = d * c;
    h *= del;
    
    if (Math.abs(del - 1) < 3e-7) break;
  }
  
  return h;
}

function gammaLn(z: number): number {
  const p = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.1208650973866179e-2,
    -0.5395239384953e-5
  ];
  
  if (z < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - gammaLn(1 - z);
  }
  
  let x = z - 1;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  
  for (let j = 0; j < p.length; j++) {
    x += 1;
    ser += p[j] / x;
  }
  
  return -tmp + Math.log(2.5066282746310005 * ser);
}

function chiSquareCDF(x: number, df: number): number {
  return betaIncomplete(df/2, 0.5, df/(df + x));
}

export function analyzeKPIData(values: number[], options: {
  stdDevModel?: 'population' | 'sample' | 'moving' | 'exponential';
  windowSize?: number;
  alpha?: number;
} = {}): KPIData {
  const {
    stdDevModel = 'sample',
    windowSize = 5,
    alpha = 0.2
  } = options;

  // Input Validation and Edge Case Handling
  if (!values || values.length === 0) {
    return {
      values: [],
      mean: null,
      standardDeviation: null,
      stdDevModelUsed: 'none',
      errorMessage: "Input array is empty or null."
    };
  }

  // Calculate mean first as it's needed for all models
  const mean = calculateMean(values);
  if (mean === null) {
    return {
      values,
      mean: null,
      standardDeviation: null,
      stdDevModelUsed: 'none',
      errorMessage: "Mean calculation failed."
    };
  }

  let standardDeviation: number | null = null;
  let modelUsed: KPIData['stdDevModelUsed'] = stdDevModel;
  let errorMessage: string | undefined = undefined;

  try {
    switch (stdDevModel) {
      case 'population':
        if (values.length >= 1) {
          standardDeviation = calculatePopulationStdDev(values, mean);
        } else {
          errorMessage = "Population standard deviation requires at least 1 data point.";
          modelUsed = 'none';
        }
        break;

      case 'moving':
        if (windowSize <= 0 || !Number.isInteger(windowSize)) {
          errorMessage = `Invalid windowSize (${windowSize}). Must be a positive integer.`;
          modelUsed = 'none';
        } else if (values.length < windowSize) {
          if (values.length >= 2) {
            standardDeviation = calculateSampleStdDev(values, mean);
            errorMessage = `Not enough data for window size ${windowSize}. Using sample SD.`;
            modelUsed = 'sample';
          } else {
            errorMessage = `Not enough data for window size ${windowSize}.`;
            modelUsed = 'none';
          }
        } else {
          const lastWindow = values.slice(-windowSize);
          const windowMean = calculateMean(lastWindow);
          if (windowMean !== null) {
            standardDeviation = calculateSampleStdDev(lastWindow, windowMean);
          }
        }
        break;

      case 'exponential':
        if (alpha <= 0 || alpha >= 1) {
          errorMessage = `Invalid alpha (${alpha}). Must be between 0 and 1.`;
          modelUsed = 'none';
        } else if (values.length >= 2) {
          standardDeviation = calculateExponentialStdDev(values, alpha);
        } else {
          errorMessage = "Exponential SD requires at least 2 data points.";
          modelUsed = 'none';
        }
        break;

      case 'sample':
      default:
        if (values.length >= 2) {
          standardDeviation = calculateSampleStdDev(values, mean);
        } else {
          errorMessage = "Sample standard deviation requires at least 2 data points.";
          modelUsed = 'none';
        }
        break;
    }
  } catch (error) {
    standardDeviation = null;
    modelUsed = 'none';
    errorMessage = `Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }

  return {
    values,
    mean,
    standardDeviation,
    stdDevModelUsed: standardDeviation === null ? 'none' : modelUsed,
    errorMessage
  };
}

// Helper functions
function calculateMean(values: number[]): number | null {
  if (!values || values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function calculatePopulationStdDev(values: number[], mean: number): number | null {
  if (!values || values.length === 0) return null;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function calculateSampleStdDev(values: number[], mean: number): number | null {
  if (!values || values.length < 2) return null;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function calculateExponentialStdDev(values: number[], alpha: number): number | null {
  if (!values || values.length < 2) return null;
  
  let ewma = values[0];
  let ewmv = 0;

  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - ewma;
    ewma = ewma + alpha * diff;
    ewmv = (1 - alpha) * (ewmv + alpha * Math.pow(diff, 2));
  }

  return Math.sqrt(Math.max(0, ewmv));
}