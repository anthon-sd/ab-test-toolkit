import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface HelpButtonProps {
  title: string;
  content: string;
  calculatorType: string;
}

const HelpButton: React.FC<HelpButtonProps> = ({ title, content, calculatorType }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Split content into sentences and add line breaks with extra spacing
  const formattedContent = content.split('. ').map((sentence, index, array) => (
    <React.Fragment key={index}>
      {sentence}{index < array.length - 1 ? '.' : ''}
      {index < array.length - 1 && (
        <>
          <br />
          <br />
        </>
      )}
    </React.Fragment>
  ));

  useEffect(() => {
    if (showHelp && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      setPosition({
        top: buttonRect.top + scrollY + 40,
        left: buttonRect.right + scrollX + 10
      });
    }
  }, [showHelp]);

  const handleClickOutside = (event: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
      setShowHelp(false);
    }
  };

  useEffect(() => {
    if (showHelp) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', () => setShowHelp(false));
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', () => setShowHelp(false));
    };
  }, [showHelp]);

  return (
    <div className="relative inline-block" ref={buttonRef}>
      {/* Help Button */}
      <button
        type="button"
        onClick={() => setShowHelp(!showHelp)}
        className="inline-flex items-center justify-center p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label={`Help for ${calculatorType}`}
      >
        <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* SEO-friendly help content (always visible to search engines) */}
      <div className="sr-only" aria-hidden="true">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{content}</p>
      </div>

      {/* Interactive tooltip */}
      {showHelp && createPortal(
        <div
          ref={tooltipRef}
          className="absolute z-[9999] w-80 rounded-md bg-[#bcc9de] p-4 shadow-lg ring-1 ring-black ring-opacity-5"
          role="tooltip"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">{formattedContent}</p>
        </div>,
        document.body
      )}
    </div>
  );
};

export default HelpButton; 