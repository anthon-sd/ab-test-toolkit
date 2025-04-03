import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
  onToggle
}: AccordionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  return (
    <div className="accordion">
      <button
        onClick={handleToggle}
        className="accordion-header"
      >
        <div className="flex items-center gap-2">
          {icon && <div className="text-accent">{icon}</div>}
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6" />
        ) : (
          <ChevronDown className="w-6 h-6" />
        )}
      </button>

      <div
        className={`accordion-content ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}