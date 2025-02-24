// components/ColorPalette.tsx
"use client";
import { colorBoxClasses, colorValueClasses } from "../utils/constants";

interface ColorPaletteProps {
  hexColor: string;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ hexColor }) => {
  return (
    <div className={colorBoxClasses}>
      <div
        className="w-full h-64 sm:h-72"
        style={{ backgroundColor: hexColor }}
      ></div>
      <div className={colorValueClasses}>
        <p className="font-semibold text-lg dark:text-gray-900 break-all">
          {" "}
          {/* Added break-all */}
          {hexColor.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default ColorPalette;
