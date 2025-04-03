export function calculateRequiredSampleSize(params) {
  const { baselineRate, expectedUplift } = params;
  
  // Z-scores for 95% confidence level and 80% power
  const zAlpha = 1.96;
  const zBeta = 0.84;
  
  const p1 = baselineRate;
  const p2 = baselineRate * (1 + expectedUplift);
  const pBar = (p1 + p2) / 2;
  
  return Math.ceil(
    2 * pBar * (1 - pBar) * Math.pow(zAlpha + zBeta, 2) / Math.pow(p2 - p1, 2)
  );
}

export function calculateSignificance(results) {
  if (results.metricType === 'conversion') {
    return calculateConversionSignificance(results);
  } else {
    return calculateContinuousSignificance(results);
  }
}

function calculateConversionSignificance(results) {
  const controlRate = results.controlGroup.conversions / results.controlGroup.size;
  const treatmentRate = results.treatmentGroup.conversions / results.treatmentGroup.size;
  const relativeUplift = (treatmentRate - controlRate) / controlRate;
  const absoluteChange = treatmentRate - controlRate;
  
  const se = Math.sqrt(
    (controlRate * (1 - controlRate) / results.controlGroup.size) +
    (treatmentRate * (1 - treatmentRate) / results.treatmentGroup.size)
  );
  
  const z = (treatmentRate - controlRate) / se;
  const pValue = 2 * (1 - normalCDF(Math.abs(z)));
  
  return {
    pValue,
    relativeUplift,
    absoluteChange,
    significant: pValue < 0.05
  };
}

function calculateContinuousSignificance(results) {
  const controlMean = results.controlGroup.mean;
  const treatmentMean = results.treatmentGroup.mean;
  const controlStdDev = results.controlGroup.stdDev;
  const treatmentStdDev = results.treatmentGroup.stdDev;
  
  const se = Math.sqrt(
    (controlStdDev ** 2 / results.controlGroup.size) +
    (treatmentStdDev ** 2 / results.treatmentGroup.size)
  );
  
  const relativeUplift = (treatmentMean - controlMean) / controlMean;
  const absoluteChange = treatmentMean - controlMean;
  
  const t = absoluteChange / se;
  const df = results.controlGroup.size + results.treatmentGroup.size - 2;
  
  const pValue = df > 30 
    ? 2 * (1 - normalCDF(Math.abs(t)))
    : 2 * (1 - studentTCDF(Math.abs(t), df));
  
  return {
    pValue,
    relativeUplift,
    absoluteChange,
    significant: pValue < 0.05
  };
}

function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - probability : probability;
}

function studentTCDF(t, df) {
  return 1 - betaIncomplete(df/2, 0.5, df/(df + t*t));
}

function betaIncomplete(a, b, x) {
  if (x < 0 || x > 1) return 0;
  const bt = Math.exp(gammaLn(a + b) - gammaLn(a) - gammaLn(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1)/(a + b + 2) ? bt * betaCF(a, b, x)/a : 1 - bt * betaCF(b, a, 1-x)/b;
}

function betaCF(a, b, x) {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - qab * x / qap;
  
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= 100; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    
    // First term
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    
    d = 1 / d;
    h *= d * c;
    
    // Second term
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    
    d = 1 / d;
    const del = d * c;
    h *= del;
    
    if (Math.abs(del - 1) < 3e-7) break;
  }
  
  return h;
}

function gammaLn(z) {
  const c = [
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
  
  for (let j = 0; j < c.length; j++) {
    x += 1;
    ser += c[j] / x;
  }
  
  return -tmp + Math.log(2.5066282746310005 * ser);
}

export function analyzeKPIData(values) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  const variance = squareDiffs.reduce((a, b) => a + b, 0) / (values.length - 1);
  const standardDeviation = Math.sqrt(variance);
  
  return {
    values,
    mean,
    standardDeviation
  };
}