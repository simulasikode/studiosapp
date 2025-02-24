// utils/types.ts

import { Dispatch, SetStateAction } from "react";

export interface ResultItem {
  label: string;
  value: number;
}

export interface CalculationData {
  id: string;
  name: string;
  timestamp: number;
  cyan: number;
  magenta: number;
  yellow: number;
  black: number;
  medium: number;
  hue: number;
  saturation: number;
  brightness: number;
  hexColor: string;
}

export interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export type CmykState = {
  cyan: number;
  setCyan: Dispatch<SetStateAction<number>>;
  magenta: number;
  setMagenta: Dispatch<SetStateAction<number>>;
  yellow: number;
  setYellow: Dispatch<SetStateAction<number>>;
  black: number;
  setBlack: Dispatch<SetStateAction<number>>;
};

export type UseCmykStateHook = (
  initialHue: number,
  initialSaturation: number,
  initialBrightness: number,
  convertHsbToCmyk: (
    hue: number,
    saturation: number,
    brightness: number,
  ) => { c: number; m: number; y: number; k: number },
) => CmykState;
