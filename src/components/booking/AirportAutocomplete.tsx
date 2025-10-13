'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Plane, X } from 'lucide-react';
import { searchAirports, Airport } from '@/lib/airports';

interface AirportAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  error?: string;
  icon?: 'map' | 'plane';
}

export default function AirportAutocomplete({
  value,
  onChange,
  placeholder,
  label,
  error,
  icon = 'map'
}: AirportAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Airport[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search airports when input changes
  useEffect(() => {
    if (inputValue.length >= 2) {
      const searchResults = searchAirports(inputValue);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [inputValue]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setSelectedIndex(-1);
  };

  const handleSelectAirport = (airport: Airport) => {
    const formattedValue = `${airport.city} (${airport.code})`;
    setInputValue(formattedValue);
    onChange(formattedValue);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectAirport(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const Icon = icon === 'plane' ? Plane : MapPin;

  return (
    <div className="flex flex-col min-w-40 flex-1" ref={containerRef}>
      {/* Label */}
      <p className="hidden lg:block text-[#111417] text-sm font-semibold mb-2 flex items-center gap-2">
        <Icon size={16} className="text-[#2472e0]" />
        {label}
      </p>

      {/* Input Container */}
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder={placeholder}
            className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none h-14 placeholder:text-[#647287] p-4 pr-10 text-base font-normal leading-normal transition-all ${
              error ? 'bg-red-50 border border-red-200' : 'bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5]'
            }`}
          />
          
          {/* Clear Button */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#647287] hover:text-[#111417] transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl border border-[#dce0e5] max-h-[320px] overflow-y-auto">
            {results.map((airport, index) => (
              <button
                key={airport.code}
                type="button"
                onClick={() => handleSelectAirport(airport)}
                className={`w-full text-left px-4 py-3 hover:bg-[#f0f2f4] transition-colors border-b border-[#dce0e5] last:border-b-0 ${
                  index === selectedIndex ? 'bg-[#f0f2f4]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#2472e0] flex items-center justify-center flex-shrink-0">
                      <Plane size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#2472e0] text-sm">{airport.code}</span>
                        <span className="text-[#111417] font-semibold text-sm truncate">
                          {airport.city}
                        </span>
                      </div>
                      <p className="text-[#647287] text-xs truncate">{airport.name}</p>
                    </div>
                  </div>
                  <span className="text-[#647287] text-xs flex-shrink-0">{airport.country}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-1 px-4 lg:px-0">{error}</p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="hidden lg:block text-[#647287] text-xs mt-1">
          Type city name or airport code (e.g., &quot;New York&quot; or &quot;JFK&quot;)
        </p>
      )}
    </div>
  );
}

