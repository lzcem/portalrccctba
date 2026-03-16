import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals/attribution';

const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onINP(onPerfEntry); // substitui o antigo onFID
  }
};

export default reportWebVitals;


