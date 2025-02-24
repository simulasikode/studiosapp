// app/service/color-process/page.tsx
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import convert from "color-convert";
import {
  FaInfoCircle,
  FaCalculator,
  FaSave,
  FaSyncAlt,
  FaTrash,
  FaFilePdf,
  FaHandPaper,
  FaSignOutAlt, // Import the logout icon
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import ColorInputComponent from "./components/ColorInput";
import ColorPalette from "./components/ColorPalette";
import ColorProfileSelect from "./components/ColorProfileSelect";
import ColorResults from "./components/ColorResults";
import Authentication from "./components/Authentication";
import {
  containerClasses,
  sectionClasses,
  headingClasses,
  cardClasses,
  buttonClasses,
  gridClasses,
  gridItemClasses,
  ICC_PROFILES,
} from "./utils/constants";
import { useToast } from "./utils/toast";
import useColorManagement from "./hooks/useColorManagement";
import useColorSpaceConversion from "./hooks/useColorSpaceConversion";
import useHsbToCmyk from "./hooks/useHsbToCmyk";
import { debounce } from "lodash";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useFirebaseCalculations } from "./hooks/useFirebaseCalculations";
import { CalculationData, ColorValues, ResultItem } from "./utils/types";
import useCmykState from "./utils/useCmykState";
import Link from "next/link";

const RETARDER_FACTOR = 0.15;

// --- SavedCalculationsTab Component (No changes needed here for logout)---
const SavedCalculationsTab = ({
  user,
  savedCalculations,
  isSigningOut,
  handleLoadCalculation,
  handleDeleteCalculation,
  generatePdf,
  buttonClasses,
}: {
  user: any;
  savedCalculations: CalculationData[];
  isSigningOut: boolean;
  handleLoadCalculation: (calculation: CalculationData) => void;
  handleDeleteCalculation: (id: string) => Promise<void>;
  generatePdf: (calculation: CalculationData) => void;
  buttonClasses: string;
}) => {
  return (
    <div className="mt-6">
      {!isSigningOut && user && (
        <div>
          {savedCalculations.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  ></th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Created
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {savedCalculations.map((calculation) => (
                  <tr key={calculation.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2">
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor:
                                calculation.hexColor || "#FFFFFF",
                              border: "1px solid #ddd",
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2  text-sm text-gray-500">
                      {calculation.name ||
                        new Date(calculation.timestamp).toLocaleString()}
                    </td>
                    <td className="px-2 py-2  text-sm text-gray-500">
                      {new Date(calculation.timestamp).toLocaleString()}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-start">
                        <button
                          className={`${buttonClasses} hover:text-blue-500 py-1 px-2 focus:outline-none focus:shadow-outline text-xs`}
                          onClick={() => handleLoadCalculation(calculation)}
                        >
                          <FaHandPaper
                            className="inline-block mr-1"
                            size="0.75em"
                          />
                          Load
                        </button>
                        <button
                          className={`${buttonClasses} hover:text-red-500 py-1 px-2 focus:outline-none focus:shadow-outline text-xs`}
                          onClick={() =>
                            handleDeleteCalculation(calculation.id)
                          }
                        >
                          <FaTrash
                            className="inline-block mr-1"
                            size="0.75em"
                          />
                          Delete
                        </button>
                        <button
                          className={`${buttonClasses} hover:text-green-500 font-bold py-1 px-2 focus:outline-none focus:shadow-outline text-xs`}
                          onClick={() => generatePdf(calculation)}
                        >
                          <FaFilePdf
                            className="inline-block mr-1"
                            size="0.75em"
                          />
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-600">No calculations saved yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

// --- CalculatorGuideTab Component ---
const CalculatorGuideTab = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">User Guide</h2>
      <p className="mb-3 text-sm text-gray-700">
        Welcome to the Color Process Calculator! This tool helps you calculate
        color mixtures for printing and digital design.
      </p>
      <h3 className="font-semibold mt-2 mb-1 text-sm text-gray-700">
        Input Color Values:
      </h3>
      <p className="text-sm mb-3 text-gray-600">
        Use the CMYK Input or HSB Input tabs to define your desired color.
      </p>
      <ul className="list-disc pl-5 text-sm mb-3 text-gray-600">
        <li>
          <b>CMYK Input:</b> Enter Cyan, Magenta, Yellow, and Black percentages.
        </li>
        <li>
          <b>HSB Input:</b> Adjust Hue, Saturation, and Brightness sliders or
          input values.
        </li>
      </ul>
      <h3 className="font-semibold mt-2 mb-1 text-sm text-gray-700">
        Select ICC Profile:
      </h3>
      <p className="text-sm mb-3 text-gray-600">
        Choose an ICC profile from the dropdown to ensure accurate color
        conversion for your target medium and device.
      </p>
      <h3 className="font-semibold mt-2 mb-1 text-sm text-gray-700">
        Calculate Mixture:
      </h3>
      <p className="text-sm mb-3 text-gray-600">
        Click the <u>Calculate</u> button to calculate the mixture ratios. The
        results will be displayed in percentages and grams for each color
        component, medium, and retarder.
      </p>
      <h3 className="font-semibold mt-2 mb-1 text-sm text-gray-700">
        Save and Manage:
      </h3>
      <p className="text-sm text-gray-600">
        Registered users can save calculations for later access:
      </p>
      <ul className="list-disc pl-5 text-sm text-gray-600">
        <li>
          Click <u>Save</u> to store the current calculation.
        </li>
        <li>
          Load saved calculations from the <b>Saved Calculations</b> tab.
        </li>
        <li>Delete calculations you no longer need.</li>
        <li>Generate PDF reports of your calculations.</li>
      </ul>
      <p className="text-sm mt-3 italic text-gray-600">
        Note: Saving and PDF export are disabled for guest users. Please{" "}
        <Link
          href="/service/color-process/auth/signup"
          className="text-blue-500 hover:underline"
        >
          sign up
        </Link>{" "}
        or{" "}
        <Link
          href="/service/color-process/auth/login"
          className="text-blue-500 hover:underline"
        >
          log in
        </Link>{" "}
        to unlock these features.
      </p>
    </div>
  );
};

const ColorCalculator = () => {
  // --- ALL HOOKS ---
  const {
    user,
    isLoading,
    isGuestUser,
    savedCalculations,
    isSigningOut,
    saveCalculation,
    deleteCalculation,
    getUserDisplayName,
    signOut, // Add the signOut function
  } = useFirebaseCalculations();
  const { convertWithProfile, selectedProfile, setSelectedProfile } =
    useColorManagement();
  const { convertHsbToCmyk } = useHsbToCmyk();
  const { rgbToHex } = useColorSpaceConversion();
  const { showToast } = useToast();

  // --- STATE VARIABLES ---
  const [medium, setMedium] = useState(0);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: "#FFFFFF",
    rgb: { r: 255, g: 255, b: 255 },
    cmyk: { c: 0, m: 0, y: 0, k: 0 },
  });
  const [results, setResults] = useState<ResultItem[]>([
    { label: "Cyan", value: 0 },
    { label: "Magenta", value: 0 },
    { label: "Yellow", value: 0 },
    { label: "Black", value: 0 },
    { label: "Medium", value: 0 },
    { label: "Retarder", value: 0 },
    { label: "TotalWeight", value: 0 },
  ]);
  const [activeTab, setActiveTab] = useState<"cmyk" | "hsb">("cmyk");
  const [guideTab, setGuideTab] = useState<"saved" | "guide">("guide"); // Default to "saved"

  const {
    cyan,
    setCyan,
    magenta,
    setMagenta,
    yellow,
    setYellow,
    black,
    setBlack,
  } = useCmykState(hue, saturation, brightness, convertHsbToCmyk);

  // --- COLOR UPDATE EFFECT ---
  const updateColors = useCallback(async () => {
    const rgb = await convertWithProfile(
      cyan,
      magenta,
      yellow,
      black,
      selectedProfile,
    );
    const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);

    setColorValues((prevColorValues) =>
      prevColorValues.hex !== hexColor ||
      prevColorValues.rgb.r !== rgb.r ||
      prevColorValues.rgb.g !== rgb.g ||
      prevColorValues.rgb.b !== rgb.b ||
      prevColorValues.cmyk.c !== cyan ||
      prevColorValues.cmyk.m !== magenta ||
      prevColorValues.cmyk.y !== yellow ||
      prevColorValues.cmyk.k !== black
        ? {
            hex: hexColor,
            rgb: rgb,
            cmyk: { c: cyan, m: magenta, y: yellow, k: black },
          }
        : prevColorValues,
    );
  }, [
    cyan,
    magenta,
    yellow,
    black,
    selectedProfile,
    convertWithProfile,
    rgbToHex,
  ]);

  useEffect(() => {
    updateColors();
  }, [updateColors]);

  // --- EVENT HANDLERS ---
  const handleHueChange = useCallback(
    (newHue: number): void => {
      setHue(newHue);
      const [newR, newG, newB] = convert.hsv.rgb(
        newHue,
        saturation,
        brightness,
      );
      const rgb = { r: newR, g: newG, b: newB };
      const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
      setColorValues({
        hex: hexColor,
        rgb: rgb,
        cmyk: { c: cyan, m: magenta, y: yellow, k: black },
      });
    },
    [saturation, brightness, rgbToHex, cyan, magenta, yellow, black],
  );

  const debouncedHandleHueChange = useMemo(
    () => debounce(handleHueChange, 250),
    [handleHueChange],
  );

  const handleReset = () => {
    setCyan(0);
    setMagenta(0);
    setYellow(0);
    setBlack(0);
    setMedium(0);
    setHue(0);
    setSaturation(100);
    setBrightness(100);
    setColorValues({
      hex: "#FFFFFF",
      rgb: { r: 255, g: 255, b: 255 },
      cmyk: { c: 0, m: 0, y: 0, k: 0 },
    });
    setResults([
      { label: "Cyan", value: 0 },
      { label: "Magenta", value: 0 },
      { label: "Yellow", value: 0 },
      { label: "Black", value: 0 },
      { label: "Medium", value: 0 },
      { label: "Retarder", value: 0 },
      { label: "TotalWeight", value: 0 },
    ]);
  };

  const handleCalculate = () => {
    const totalInput = cyan + magenta + yellow + black + medium;
    if (totalInput === 0) {
      showToast("Invalid Input", "Provide non-zero percentage.", "error");
      return;
    }
    const totalColor = cyan + magenta + yellow + black;
    const retarder = totalColor * RETARDER_FACTOR;
    const weights = [
      { label: "Cyan", value: (cyan / totalInput) * 100 },
      { label: "Magenta", value: (magenta / totalInput) * 100 },
      { label: "Yellow", value: (yellow / totalInput) * 100 },
      { label: "Black", value: (black / totalInput) * 100 },
      { label: "Medium", value: (medium / totalInput) * 100 },
      { label: "Retarder", value: retarder },
      { label: "TotalWeight", value: totalInput },
    ];
    setResults(weights);
    showToast("Calculation Complete", "Color mixture calculated.", "success");
  };

  const handleSaveCalculation = async () => {
    if (isGuestUser) {
      showToast(
        "Saving Disabled",
        "Saving calculations is not available for guest users. Please sign up or log in to save.",
        "warning",
      );
      return;
    }

    const id = Date.now().toString();
    const currentHexColor = colorValues.hex || "#FFFFFF";

    const calculationData: CalculationData = {
      id,
      name: currentHexColor,
      timestamp: Date.now(),
      cyan,
      magenta,
      yellow,
      black,
      medium,
      hue,
      saturation,
      brightness,
      hexColor: currentHexColor,
    };
    await saveCalculation(calculationData);
    showToast("Success", `Calculation saved as ${currentHexColor}!`, "success");
  };

  const handleLoadCalculation = (calculation: CalculationData) => {
    setCyan(calculation.cyan);
    setMagenta(calculation.magenta);
    setYellow(calculation.yellow);
    setBlack(calculation.black);
    setMedium(calculation.medium);
    setHue(calculation.hue);
    setSaturation(calculation.saturation);
    setBrightness(calculation.brightness);
    handleCalculate();
  };

  const handleDeleteCalculation = async (id: string) => {
    deleteCalculation(id);
  };

  const generatePdf = (calculation: CalculationData) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(
      `Color Calculation Report: ${calculation.name || "Untitled"}`,
      10,
      10,
    );
    doc.setFontSize(12);
    doc.text(
      `Date Created: ${new Date(calculation.timestamp).toLocaleString()}`,
      10,
      20,
    );

    const colorInfo = [
      ["Property", "Value"],
      ["Cyan", `${calculation.cyan}%`],
      ["Magenta", `${calculation.magenta}%`],
      ["Yellow", `${calculation.yellow}%`],
      ["Black", `${calculation.black}%`],
      ["Medium", `${calculation.medium}%`],
      ["Hue", `${calculation.hue}°`],
      ["Saturation", `${calculation.saturation}%`],
      ["Brightness", `${calculation.brightness}%`],
      ["Hex Code", colorValues.hex],
    ];

    let lastTableY = 0;
    autoTable(doc, {
      startY: 30,
      head: [["Property", "Value"]],
      body: colorInfo,
      didDrawPage: (data) => {
        lastTableY = data.cursor ? data.cursor.y : lastTableY;
      },
    });

    const totalInput =
      calculation.cyan +
      calculation.magenta +
      calculation.yellow +
      calculation.black +
      calculation.medium;
    const gramsInfo = results.map((result) => {
      const grams = (result.value / 100) * totalInput;
      return [result.label, `${grams.toFixed(2)} g`];
    });

    autoTable(doc, {
      startY: lastTableY + 10,
      head: [["Component", "Weight (g)"]],
      body: gramsInfo,
    });
    doc.save(`color_calculation_${calculation.id}.pdf`);
  };

  // --- RENDER ---
  return (
    <div className={containerClasses}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={sectionClasses}>
            <h1 className={headingClasses}>Color Process Calculator</h1>
            <h2 className="text-[22.5px] uppercase m-4 max-w-2xl leading-[82%] text-center">
              Digital tools are designed to simplify the complex process of
              color mixing and conversion.
            </h2>
            <p className="text-sm text-center max-w-lg leading-[92%]">
              These tools allow users to input color values from various models,
              such as CMYK and HSB. The ICC color profiles ensure accuracy
              across different devices and media. In addition to basic color
              conversion, these tools include a mixing calculator that enables
              users to specify desired colors and mixing ratios. This feature
              helps achieve precise color formulations for printing and other
              applications.
            </p>
          </div>

          <div className={gridClasses}>
            <div className={gridItemClasses}>
              <div className={`${cardClasses} mt-6 `}>
                <ColorPalette hexColor={colorValues.hex} />
                <ColorResults results={results} />
              </div>

              <div className="px-8 py-6">
                <div className="flex space-x-4">
                  <button className={buttonClasses} onClick={handleReset}>
                    <FaInfoCircle className="inline-block mr-2" /> Reset
                  </button>
                  <button className={buttonClasses} onClick={handleCalculate}>
                    <FaCalculator className="inline-block mr-2" />
                    Calculate
                  </button>
                  <button
                    className={buttonClasses}
                    onClick={handleSaveCalculation}
                    disabled={isGuestUser}
                  >
                    <FaSave className="inline-block mr-2" />
                    Save
                  </button>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 border-x border-primary">
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
                <div className={cardClasses}>
                  <h2 className="font-bold mb-2 mt-6">ICC Profile</h2>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Select Color Profile:
                    </label>
                    <ColorProfileSelect
                      options={ICC_PROFILES}
                      selectedProfile={selectedProfile}
                      setSelectedProfile={setSelectedProfile}
                    />
                    <p className="text-gray-500 text-xs mb-2 mt-2">
                      Select color profile for conversion
                    </p>
                  </div>
                </div>

                <div className={cardClasses}>
                  <div className="mb-16">
                    <h2 className="text-lg font-semibold mb-2 mt-6">Medium</h2>
                    <div>
                      <ColorInputComponent
                        label="Medium"
                        value={medium}
                        max={100}
                        onChange={setMedium}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-4 border-t border-primary mt-2">
                <div className={cardClasses}>
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                      <button
                        onClick={() => setActiveTab("cmyk")}
                        className={`${
                          activeTab === "cmyk"
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap border-b-2 py-4 px-1 font-medium text-sm`}
                      >
                        CMYK Input
                      </button>
                      <button
                        onClick={() => setActiveTab("hsb")}
                        className={`${
                          activeTab === "hsb"
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap border-b-2 py-4 px-1 font-medium text-sm`}
                      >
                        HSB Input
                      </button>
                    </nav>
                  </div>

                  {activeTab === "cmyk" && (
                    <div className="space-y-5 p-4">
                      <h2 className="text-lg font-semibold mb-6">CMYK Input</h2>
                      {["Cyan", "Magenta", "Yellow", "Black"].map(
                        (label, index) => {
                          const value = [cyan, magenta, yellow, black][index];
                          const setter = [
                            setCyan,
                            setMagenta,
                            setYellow,
                            setBlack,
                          ][index];
                          return (
                            <ColorInputComponent
                              key={label}
                              label={label}
                              value={value}
                              max={100}
                              onChange={setter}
                              unit="%"
                            />
                          );
                        },
                      )}
                    </div>
                  )}

                  {activeTab === "hsb" && (
                    <div className="p-4">
                      <h2 className="text-lg font-semibold mb-2">HSB Input</h2>
                      <p className="text-sm mb-10">
                        HSB (Hue, Saturation, Brightness) describes colors
                        intuitively, aligning with human perception.
                      </p>
                      <div className="w-full mt-2">
                        <div
                          className="relative h-5 cursor-pointer mb-4"
                          style={{
                            background:
                              "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)",
                          }}
                          onClick={(e) => {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const newHue = Math.round((x / rect.width) * 360);
                            debouncedHandleHueChange(
                              Math.min(360, Math.max(0, newHue)),
                            );
                          }}
                        >
                          <div
                            className="absolute left-0 top-[-2px] w-6 h-6 bg-white rounded-full border border-primary transform -translate-x-1/2"
                            style={{ left: `${(hue / 360) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        {["Hue", "Saturation", "Brightness"].map(
                          (label, index) => {
                            const value = [hue, saturation, brightness][index];
                            const setter = [
                              setHue,
                              setSaturation,
                              setBrightness,
                            ][index];
                            const max = [360, 100, 100][index];
                            const unit = ["°", "%", "%"][index];
                            return (
                              <ColorInputComponent
                                key={label}
                                label={label}
                                value={value}
                                max={max}
                                onChange={setter}
                                unit={unit}
                              />
                            );
                          },
                        )}

                        <button
                          className={buttonClasses}
                          onClick={() => {
                            const { c, m, y, k } = convertHsbToCmyk(
                              hue,
                              saturation,
                              brightness,
                            );
                            setCyan(c);
                            setMagenta(m);
                            setYellow(y);
                            setBlack(k);
                            showToast(
                              "CMYK Updated",
                              "CMYK values updated from HSB.",
                              "success",
                            );
                          }}
                        >
                          <FaSyncAlt className="inline-block mr-2" /> Update
                          from HSB
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- TABBED GUIDE SECTION --- */}
            <div className="col-span-12 md:col-span-5 mb-16">
              <div className="mt-6 px-6">
                {user ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <p className="text-sm font-black">
                        Welcome: {getUserDisplayName()}!
                      </p>
                      <button
                        className="text-sm hover:underline"
                        onClick={signOut}
                      >
                        <FaSignOutAlt className="inline-block mr-1" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <Authentication />
                )}
              </div>

              <div className={cardClasses}>
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                      onClick={() => setGuideTab("guide")}
                      className={`${
                        guideTab === "guide"
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap border-b-2 py-4 px-1 font-medium text-sm`}
                    >
                      Calculator Guide
                    </button>
                    {/* Show Saved Calculations if there is a user, otherwise don't show it */}
                    {user && (
                      <button
                        onClick={() => setGuideTab("saved")}
                        className={`${
                          guideTab === "saved"
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap border-b-2 py-4 px-1 font-medium text-sm`}
                      >
                        Saved Calculations
                      </button>
                    )}
                  </nav>{" "}
                </div>

                {guideTab === "saved" ? (
                  <SavedCalculationsTab
                    user={user}
                    savedCalculations={savedCalculations}
                    isSigningOut={isSigningOut}
                    handleLoadCalculation={handleLoadCalculation}
                    handleDeleteCalculation={handleDeleteCalculation}
                    generatePdf={generatePdf}
                    buttonClasses={buttonClasses}
                  />
                ) : (
                  <CalculatorGuideTab /> // <--- THIS IS THE FIX
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default ColorCalculator;
