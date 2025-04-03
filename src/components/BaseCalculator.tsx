import { Calculator } from 'lucide-react';

interface BaseCalculatorProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function BaseCalculator({ 
  title, 
  description, 
  icon = <Calculator />, 
  children 
}: BaseCalculatorProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <div className="text-primary">{icon}</div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {description && (
            <p className="text-gray-600 text-sm mt-1">{description}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}