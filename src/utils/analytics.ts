import { DataLayerEvent } from './gtm';

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}

export const initializeAnalytics = () => {
  window.dataLayer = window.dataLayer || [];
};

export const trackEvent = (eventName: string, eventData: Record<string, any> = {}): void => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }
};

export const trackCalculation = (
  calculatorType: string,
  inputs: Record<string, any>,
  results: Record<string, any>
) => {
  trackEvent('calculator_used', {
    calculator_type: calculatorType,
    inputs,
    results
  });
};

export const trackDownload = (
  fileType: string,
  data: Record<string, any>
) => {
  trackEvent('file_downloaded', {
    file_type: fileType,
    ...data
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