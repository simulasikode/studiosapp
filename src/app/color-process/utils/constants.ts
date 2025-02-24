// utils/constants.ts
export const containerClasses = "relative w-[100vw]";
export const sectionClasses = "relative  m-16 flex flex-col  items-center ";
export const headingClasses =
  "text-4xl sm:text-5xl lg:text-[75px] text-center uppercase leading-[82%] tracking-tighter font-black -ml-[10px] pl-[10px]";
export const cardClasses = "px-6";
export const labelClasses = "block text-sm font-bold text-foreground mb-2";
export const inputClasses =
  "focus:outline-none block w-full sm:text-sm border-b border-primary bg-gray-50 dark:bg-[#161616] py-[10px] px-4";
export const buttonClasses =
  "bg-foreground hover:bg-primary text-background block items-center text-xs text-left px-4 py-4 focus:outline-none cursor-pointer" +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 hover:disabled:bg-gray-400 hover:disabled:cursor-not-allowed hover:disabled:opacity-50";
export const gridClasses =
  "grid grid-cols-12 -ml-[10px] border-y border-primary";
export const gridItemClasses = "col-span-12 md:col-span-3";
export const colorBoxClasses = "w-full overflow-hidden relative";
export const colorValueClasses =
  "absolute bottom-0 left-0 right-0 backdrop-blur-sm p-4";
export const resultsClasses = "pt-4 ";

export interface Profile {
  name: string;
  path: string;
}

export const ICC_PROFILES: Profile[] = [
  { name: "sRGB", path: "/icc/sRGB_v4_ICC_preference.icc" },
  { name: "Adobe RGB", path: "/icc/AdobeRGB1998.icc" },
  { name: "CMYK Coated", path: "/icc/CoatedFOGRA39.icc" },
  { name: "CMYK Uncoated", path: "/icc/UncoatedFOGRA29.icc" },
];
