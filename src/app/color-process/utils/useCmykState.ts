// hooks/useCmykState.ts
import { useState, useEffect } from "react";
import { UseCmykStateHook, CmykState } from "../utils/types"; // Import types

// Custom Hook for Managing CMYK State
const useCmykState: UseCmykStateHook = (
  // Apply type here
  initialHue: number,
  initialSaturation: number,
  initialBrightness: number,
  convertHsbToCmyk: (
    hue: number,
    saturation: number,
    brightness: number,
  ) => { c: number; m: number; y: number; k: number },
): CmykState => {
  // Explicitly return CmykState
  const [cyan, setCyan] = useState(0);
  const [magenta, setMagenta] = useState(0);
  const [yellow, setYellow] = useState(0);
  const [black, setBlack] = useState(0);

  useEffect(() => {
    const { c, m, y, k } = convertHsbToCmyk(
      initialHue,
      initialSaturation,
      initialBrightness,
    );
    setCyan(c);
    setMagenta(m);
    setYellow(y);
    setBlack(k);
  }, [initialHue, initialSaturation, initialBrightness, convertHsbToCmyk]);

  return {
    cyan,
    setCyan,
    magenta,
    setMagenta,
    yellow,
    setYellow,
    black,
    setBlack,
  };
};

export default useCmykState; // Export the hook function
