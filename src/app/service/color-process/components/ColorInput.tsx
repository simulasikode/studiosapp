// components/ColorInput.tsx
"use client";
import { labelClasses, inputClasses } from "../utils/constants";
import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";

interface ColorInputProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  onChange: (newValue: number) => void;
}

// Define the type for the debounced function, including cancel
type DebouncedFunc = ((newValue: number) => void) & { cancel(): void };

const ColorInput: React.FC<ColorInputProps> = ({
  label,
  value,
  max,
  unit = "%",
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<number>(value);

  const debouncedOnChangeRef = useRef<DebouncedFunc>(
    debounce((newValue: number) => {
      onChange(newValue);
    }, 200),
  );

  // Update the debounced function whenever the onChange changes
  useEffect(() => {
    debouncedOnChangeRef.current = debounce((newValue: number) => {
      onChange(newValue);
    }, 200);

    return () => {
      debouncedOnChangeRef.current.cancel();
    };
  }, [onChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^\d.]/g, "");
    let numValue = parseFloat(sanitizedValue) || 0;
    numValue = Math.min(Math.max(numValue, 0), max);
    const roundedValue = Math.round(numValue * 100) / 100;
    setInputValue(roundedValue);
    debouncedOnChangeRef.current(roundedValue);
  };

  return (
    <div>
      <label htmlFor={label.toLowerCase()} className={labelClasses}>
        {label}:
      </label>
      <div className="relative">
        <input
          type="number"
          id={label.toLowerCase()}
          className={inputClasses}
          value={inputValue}
          min={0}
          max={max}
          step="0.01" // Allow for decimal input
          onChange={handleChange}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 mr-6">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default ColorInput;
