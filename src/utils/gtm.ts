interface DataLayer {
  event?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    dataLayer: DataLayer[];
  }
}

export const GTM_ID = 'GTM-N47K4WV9';

// Initialize dataLayer if it doesn't exist
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

export const pushToDataLayer = (data: DataLayer): void => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

export const trackEvent = (
  eventName: string,
  eventProperties?: Record<string, any>
): void => {
  const eventData = {
    event: eventName,
    event_category: 'User Action',
    event_timestamp: new Date().toISOString(),
    ...eventProperties,
  };
  pushToDataLayer(eventData);
};

export const trackCalculation = (
  calculatorType: string,
  inputValues: Record<string, any>,
  results: Record<string, any>
): void => {
  trackEvent('calculation_completed', {
    calculator_type: calculatorType,
    inputs: inputValues,
    results: results,
    timestamp: new Date().toISOString()
  });
};

// Specific calculator tracking functions
export const trackUpliftCalculation = (kpiData: any, uplifts: any): void => {
  trackCalculation('uplift', {
    metric_type: 'kpi',
    data_points: kpiData.values.length,
    mean: kpiData.mean,
    std_dev: kpiData.standardDeviation
  }, {
    conservative_uplift: uplifts.conservative,
    moderate_uplift: uplifts.moderate,
    aggressive_uplift: uplifts.aggressive
  });
};

export const trackSampleSizeCalculation = (params: any, sampleSize: number): void => {
  trackCalculation('sample_size', {
    kpi_type: params.kpiType,
    baseline_rate: params.baselineRate,
    expected_uplift: params.expectedUplift,
    confidence_level: params.confidenceLevel,
    power: params.power
  }, {
    required_sample_size: sampleSize
  });
};

export const trackSignificanceCalculation = (results: any, stats: any): void => {
  trackCalculation('significance', {
    metric_type: results.metricType,
    control_size: results.controlGroup.size,
    treatment_size: results.treatmentGroup.size
  }, {
    p_value: stats.pValue,
    relative_uplift: stats.relativeUplift,
    absolute_change: stats.absoluteChange,
    significant: stats.significant
  });
};

export const trackRuntimeCalculation = (data: {
  required_sample_size: number;
  daily_traffic: number;
  split_ratio: number;
  estimated_days: number;
}): void => {
  trackCalculation('runtime', {
    required_sample_size: data.required_sample_size,
    daily_traffic: data.daily_traffic,
    split_ratio: data.split_ratio,
    traffic_allocation: `${data.split_ratio * 100}/${100 - (data.split_ratio * 100)}`,
    daily_variant_traffic: data.daily_traffic * data.split_ratio
  }, {
    estimated_runtime: {
      days: data.estimated_days,
      weeks: Math.ceil(data.estimated_days / 7),
      months: Math.ceil(data.estimated_days / 30)
    },
    completion_date: new Date(Date.now() + (data.estimated_days * 24 * 60 * 60 * 1000)).toISOString(),
    daily_progress_rate: ((1 / data.estimated_days) * 100).toFixed(2) + '%'
  });
};

export const trackRuntimeInputChange = (
  fieldName: string,
  value: string | number,
  calculatorState: {
    dailyTraffic?: string | number;
    splitRatio?: string | number;
    requiredSampleSize?: number;
  }
): void => {
  trackEvent('runtime_input_change', {
    field_name: fieldName,
    new_value: value,
    calculator_state: calculatorState,
    timestamp: new Date().toISOString()
  });
};

export const trackSplitRatioChange = (
  newRatio: string,
  currentTraffic: string,
  requiredSampleSize: number
): void => {
  trackEvent('split_ratio_change', {
    new_ratio: newRatio,
    current_traffic: currentTraffic,
    required_sample_size: requiredSampleSize,
    estimated_impact: {
      daily_variant_traffic: parseFloat(currentTraffic) * (parseInt(newRatio) / 100),
      allocation_distribution: `${newRatio}/${100 - parseInt(newRatio)}`
    },
    timestamp: new Date().toISOString()
  });
};

export const trackPDFDownload = (
  calculatorType: string,
  data: Record<string, any>
): void => {
  trackEvent('pdf_download', {
    event_category: 'PDF Download',
    calculator_type: calculatorType,
    data_included: data,
    timestamp: new Date().toISOString(),
    file_name: `${calculatorType}-results.pdf`
  });
};

export const trackAccordionOpen = (
  sectionName: string,
  isOpen: boolean
): void => {
  trackEvent('accordion_interaction', {
    event_category: 'UI Interaction',
    section_name: sectionName,
    action: isOpen ? 'open' : 'close',
    timestamp: new Date().toISOString()
  });
};

export const trackContactClick = (
  linkType: string,
  destination: string
): void => {
  trackEvent('contact_click', {
    event_category: 'Outbound Link',
    link_type: linkType,
    destination: destination,
    timestamp: new Date().toISOString()
  });
};