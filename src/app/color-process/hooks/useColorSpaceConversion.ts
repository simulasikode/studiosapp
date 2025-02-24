// hooks/useColorSpaceConversion.ts
"use client";
import { useCallback } from "react";

import { RGB } from "./useColorManagement"; // Added the import from useColorManagement

const useColorSpaceConversion = () => {
  const cmykToRgb = useCallback(
    (c: number, m: number, y: number, k: number): RGB => {
      const C: number = c / 100;
      const M: number = m / 100;
      const Y: number = y / 100;
      const K: number = k / 100;

      const r: number = 255 * (1 - C) * (1 - K);
      const g: number = 255 * (1 - M) * (1 - K);
      const b: number = 255 * (1 - Y) * (1 - K);

      const gammaCorrect = (value: number): number => {
        const v: number = value / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };

      return {
        r: Math.round(gammaCorrect(r) * 255),
        g: Math.round(gammaCorrect(g) * 255),
        b: Math.round(gammaCorrect(b) * 255),
      };
    },
    [],
  );

  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    const toHex = (n: number): string => {
      const hex: string = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, []);

  const getDisplayColor = useCallback(
    (c: number, m: number, y: number, k: number): string => {
      const rgb: RGB = cmykToRgb(c, m, y, k);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    },
    [cmykToRgb, rgbToHex],
  );

  return { cmykToRgb, rgbToHex, getDisplayColor };
};

export default useColorSpaceConversion;
