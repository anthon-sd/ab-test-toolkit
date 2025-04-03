import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Initialize dataLayer
window.dataLayer = window.dataLayer || [];

// Push initial page load event
window.dataLayer.push({
  event: 'page_load',
  page_title: document.title,
  page_location: window.location.href,
  page_path: window.location.pathname,
  timestamp: new Date().toISOString()
});

// Mount app with error boundary
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);