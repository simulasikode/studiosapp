// hooks/useHsbToCmyk.ts
"use client";
import { useCallback } from "react";
import convert from "color-convert";

import { CMYK } from "./useColorManagement"; // Added the import from useColorManagement

const useHsbToCmyk = () => {
  const convertHsbToCmyk = useCallback(
    (h: number, s: number, b: number): CMYK => {
      const [r, g, blue] = convert.hsv.rgb(h, s, b);
      const cmyk = convert.rgb.cmyk(r, g, blue);

      return {
        c: Math.round(cmyk[0]),
        m: Math.round(cmyk[1]),
        y: Math.round(cmyk[2]),
        k: Math.round(cmyk[3]),
      };
    },
    [],
  );

  return { convertHsbToCmyk };
};

export default useHsbToCmyk;
