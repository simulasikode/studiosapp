// components/ColorProfileSelect.tsx
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { IoCheckmarkOutline, IoChevronDown } from "react-icons/io5";

interface Profile {
  name: string;
  path: string;
}

interface ColorProfileSelectProps {
  options: Profile[];
  selectedProfile: string;
  setSelectedProfile: (profileName: string) => void;
}

const ColorProfileSelect: React.FC<ColorProfileSelectProps> = ({
  options,
  selectedProfile,
  setSelectedProfile,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <div className="relative w-full" ref={selectRef}>
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2 border border-primary bg-gray-50 dark:bg-[#161616] text-left cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedProfile}
        <span>
          <IoChevronDown size={16} />
        </span>
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 bg-background dark:bg-[#161616] border border-primary">
          {options.map((profile) => (
            <CustomOption
              key={profile.path}
              profile={profile}
              selectedProfile={selectedProfile}
              setSelectedProfile={setSelectedProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CustomOptionProps {
  profile: { name: string; path: string };
  selectedProfile: string;
  setSelectedProfile: (profileName: string) => void;
}

const CustomOption: React.FC<CustomOptionProps> = ({
  profile,
  selectedProfile,
  setSelectedProfile,
}) => {
  const isSelected = profile.name === selectedProfile;

  const handleClick = useCallback(() => {
    setSelectedProfile(profile.name);
  }, [setSelectedProfile, profile.name]);

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:opacity-60 dark:hover:bg-[#161616] ${
        isSelected ? "bg-background dark:bg-[#161616]" : ""
      }`}
      onClick={handleClick}
    >
      <span>{profile.name}</span>
      {isSelected && (
        <span className="text-foreground">
          <IoCheckmarkOutline />
        </span>
      )}
    </div>
  );
};

export default ColorProfileSelect;
