// components/ColorResults.tsx
import { labelClasses } from "../utils/constants";

interface ResultItem {
  label: string;
  value: number;
}

interface ColorResultsProps {
  results: ResultItem[];
}

const ColorResults: React.FC<ColorResultsProps> = ({ results }) => {
  // Memoize filtered results for "Colors" section
  const colorResults = results.filter((r) =>
    ["Cyan", "Magenta", "Yellow", "Black"].includes(r.label),
  );

  // Memoize filtered results for "Medium" section
  const mediumResults = results.filter((r) =>
    ["Medium", "Retarder", "TotalWeight"].includes(r.label),
  );

  return (
    <div>
      {results && Array.isArray(results) && (
        <div className="mt-6">
          <p className="mb-2 font-black">Results</p>
          <div className="grid grid-cols-1 gap-4">
            {/* Mapping Colors */}
            <div>
              <p className={`${labelClasses} mt-2 font-semibold`}>Colors</p>
              <div>
                {colorResults.map((result) => (
                  <div
                    className="text-sm flex justify-between align-baseline mb-2 pb-2 border-b border-primary"
                    key={result.label}
                  >
                    <p>{result.label}</p>
                    <span>{result.value.toFixed(1)} grams</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapping Medium */}
            <div>
              <p className={`${labelClasses} mt-2 font-semibold`}>Medium</p>
              <div>
                {mediumResults.map((result) => (
                  <div
                    className={`text-sm flex items-center justify-between align-baseline border-b border-primary mb-2 pb-2${
                      result.label === "TotalWeight"
                        ? "font-bold mb-2 pb-2"
                        : ""
                    }`}
                    key={result.label}
                  >
                    <p>{result.label}</p>
                    <span>{result.value.toFixed(1)} grams</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorResults;
