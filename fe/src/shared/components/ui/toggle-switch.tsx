import React from 'react';

interface ToggleSwitchProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: {
    value: T;
    label: string;
    colors: {
      from: string;
      to: string;
      text: string;
    };
  }[];
  className?: string;
}

export function ToggleSwitch<T extends string>({ 
  value, 
  onChange, 
  options, 
  className = "" 
}: ToggleSwitchProps<T>) {
  const selectedIndex = options.findIndex(option => option.value === value);
  const selectedOption = options[selectedIndex];

  return (
    <div className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-0.5 border border-white/20 ${className}`}>
      {/* Toggle Buttons */}
      <div className="relative flex w-full">
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative flex items-center justify-center flex-1 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 z-10 whitespace-nowrap ${
              index === 0 ? 'px-2' : 'px-2 pl-3'
            } ${
              value === option.value 
                ? option.colors.text
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      {/* Sliding Background */}
      <div 
        className={`absolute top-0.5 bottom-0.5 bg-gradient-to-r rounded-lg transition-all duration-300 ease-in-out ${selectedOption?.colors.from} ${selectedOption?.colors.to}`}
        style={{
          width: `calc(${100 / options.length}% - 2px)`,
          transform: `translateX(calc(${selectedIndex * 100}% + ${selectedIndex * 2}px))`
        }}
      />
    </div>
  );
} 