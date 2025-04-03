interface AnalyticsEvent {
  event: string;
  event_category: string;
  event_timestamp: string;
  [key: string]: any;
}

interface DataLayer {
  push: (event: AnalyticsEvent) => void;
}

declare global {
  interface Window {
    dataLayer: DataLayer;
  }
}

export const initializeAnalytics = () => {
  window.dataLayer = window.dataLayer || [];
};

export const trackEvent = (
  eventName: string,
  eventProperties: Record<string, any> = {}
) => {
  if (typeof window === 'undefined') return;

  const event: AnalyticsEvent = {
    event: eventName,
    event_category: 'User Action',
    event_timestamp: new Date().toISOString(),
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...eventProperties
  };

  window.dataLayer.push(event);
};

export const trackCalculation = (
  calculatorType: string,
  inputs: Record<string, any>,
  results: Record<string, any>
) => {
  trackEvent('calculation_completed', {
    calculator_type: calculatorType,
    inputs,
    results
  });
};

export const trackDownload = (
  fileType: string,
  data: Record<string, any>
) => {
  trackEvent('file_download', {
    file_type: fileType,
    data_included: data
  });
};

export const trackUIInteraction = (
  elementType: string,
  action: string,
  details: Record<string, any> = {}
) => {
  trackEvent('ui_interaction', {
    element_type: elementType,
    action,
    ...details
  });
};