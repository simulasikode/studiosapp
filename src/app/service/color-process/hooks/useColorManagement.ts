// hooks/useColorManagement.ts
"use client";
import { useState, useCallback } from "react";
import convert from "color-convert";

export interface RGB {
  // Export the interface
  r: number;
  g: number;
  b: number;
}

export interface CMYK {
  // Export the interface
  c: number;
  m: number;
  y: number;
  k: number;
}

const ICC_PROFILES = [
  { name: "sRGB", path: "/icc/sRGB_v4_ICC_preference.icc" },
  { name: "Adobe RGB", path: "/icc/AdobeRGB1998.icc" },
  { name: "CMYK Coated", path: "/icc/CoatedFOGRA39.icc" },
  { name: "CMYK Uncoated", path: "/icc/UncoatedFOGRA29.icc" },
];

const useColorManagement = () => {
  const [selectedProfile, setSelectedProfile] = useState<string>("CMYK Coated");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const applyProfileAdjustment = useCallback(
    (r: number, g: number, b: number, profile: string): RGB => {
      let adjustedRGB: RGB = { r, g, b };

      switch (profile) {
        case "CMYK Coated":
          adjustedRGB = {
            r: Math.min(255, r * 1.1),
            g: Math.min(255, g * 1.1),
            b: Math.min(255, b * 1.1),
          };
          break;
        case "CMYK Uncoated":
          adjustedRGB = {
            r: r * 0.9,
            g: g * 0.9,
            b: b * 0.9,
          };
          break;
        case "Adobe RGB":
          adjustedRGB = {
            r: Math.min(255, r * 1.2),
            g: Math.min(255, g * 1.15),
            b: Math.min(255, b * 1.15),
          };
          break;
        default:
          break;
      }

      return adjustedRGB;
    },
    [],
  );

  const basicCMYKtoRGB = useCallback(
    (c: number, m: number, y: number, k: number): RGB => {
      const C: number = c / 100;
      const M: number = m / 100;
      const Y: number = y / 100;
      const K: number = k / 100;

      const r: number = 255 * (1 - C) * (1 - K);
      const g: number = 255 * (1 - M) * (1 - K);
      const b: number = 255 * (1 - Y) * (1 - K);

      return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
    },
    [],
  );

  const convertWithProfile = useCallback(
    async (
      c: number,
      m: number,
      y: number,
      k: number,
      profile: string = "CMYK Coated",
    ): Promise<RGB> => {
      try {
        setIsLoading(true);

        const [r, g, b] = convert.cmyk.rgb(c, m, y, k);

        const adjustedRGB = applyProfileAdjustment(r, g, b, profile);

        return {
          r: Math.round(adjustedRGB.r),
          g: Math.round(adjustedRGB.g),
          b: Math.round(adjustedRGB.b),
        };
      } catch (error: unknown) {
        // Use 'any' here or provide a more specific type
        console.error("Color conversion error:", error);

        if (typeof error === "object" && error !== null && "message" in error) {
          console.error(
            "Error message:",
            (error as { message: string }).message,
          ); // Type assertion
        } else {
          console.error("Unknown error type:", error);
        }
        //Fallback to Basic Conversion
        return basicCMYKtoRGB(c, m, y, k);
      } finally {
        setIsLoading(false);
      }
    },
    [applyProfileAdjustment, basicCMYKtoRGB],
  );

  return {
    convertWithProfile,
    selectedProfile,
    setSelectedProfile,
    isLoading,
    availableProfiles: ICC_PROFILES.map((p) => p.name),
  };
};

export default useColorManagement;
