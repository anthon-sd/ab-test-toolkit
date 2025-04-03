import { Download } from 'lucide-react';

interface ResultsDisplayProps {
  title: string;
  results: Record<string, any>;
  onDownload?: () => void;
  className?: string;
}

export default function ResultsDisplay({
  title,
  results,
  onDownload,
  className = ''
}: ResultsDisplayProps) {
  return (
    <div className={`results-container ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
        {onDownload && (
          <button
            onClick={onDownload}
            className="btn btn-primary"
          >
            <Download className="w-4 h-4" />
            <span>Download Results</span>
          </button>
        )}
      </div>

      <div className="results-grid">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="result-item">
            <p className="result-label">{key}</p>
            <p className="result-value">
              {typeof value === 'number' 
                ? value.toLocaleString(undefined, { 
                    maximumFractionDigits: 2 
                  })
                : value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}