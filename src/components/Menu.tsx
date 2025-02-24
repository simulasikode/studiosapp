"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaSpotify,
  FaPinterest,
} from "react-icons/fa";
import { TbMenu } from "react-icons/tb";
import { X } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import ThemeSwitcher from "./ThemeSwitcher";

const RGBBackground = dynamic(() => import("@/components/RGBBackground"), {
  ssr: false,
});

const socialLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com/simulasi.studio",
    icon: <FaInstagram size={24} />,
  },
  {
    name: "Pinterest",
    url: "https://id.pinterest.com/simulasistudio",
    icon: <FaPinterest size={24} />,
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/playlist/3XyiHPHr7sd4q0eYm5ZY2U",
    icon: <FaSpotify size={24} />,
  },

  {
    name: "Linkedin",
    url: "https://www.linkedin.com/in/simulasi-studio/",
    icon: <FaLinkedin size={24} />,
  },
  {
    name: "GitHub",
    url: "https://github.com/simulasikode/studiosapp",
    icon: <FaGithub size={24} />,
  },
];

const menuSections = [
  {
    title: "Studio",
    items: [
      { name: "About Us", link: "/about" },
      { name: "Case Studies", link: "#" },
      { name: "Portfolio", link: "#" },
    ],
  },
  {
    title: "Services",
    items: [
      { name: "Press Price", link: "/service/pressprice" },
      { name: "The Process Color", link: "/service/color-process" },
      {
        name: "Request",
        link: "https://forms.fillout.com/t/pFE4XxyiXGus",
        isExternal: true,
      },
      { name: "Product", link: "#" },
    ],
  },
  {
    title: "Pre-Press",
    items: [
      { name: "Foreword", link: "#" },
      { name: "Color", link: "#" },
      { name: "Paper", link: "#" },
      { name: "Printing", link: "#" },
    ],
  },
];

// Menu Variants
const menuVariants = {
  open: {
    y: "0%",
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  closed: {
    y: "-100%",
    transition: { duration: 0.4, ease: "easeInOut", when: "afterChildren" },
  },
};

// Menu Item Variants
const menuItemVariants = {
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.08,
      delayChildren: 0.2,
      staggerDirection: -1,
    },
  },
  closed: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.3, staggerChildren: 0.05, staggerDirection: -1 },
  },
};

// Social Icon Variants
const socialIconVariants = {
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, staggerChildren: 0.08 },
  },
  closed: {
    opacity: 0,
    y: -8,
    scale: 0.95,
    transition: { duration: 0.3, staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const menuTextVariants = {
  initial: { opacity: 0, x: 10 },
  hover: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  unhover: {
    opacity: 0,
    x: 10,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hidden: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuTextRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <ThemeSwitcher />
      <div className="sticky top-3 z-10 flex justify-center mx-auto text-xs text-white mix-blend-difference">
        <Link href="/" className="group relative inline-block">
          Simulasi Studio
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
        </Link>
      </div>
      {!isOpen && (
        <button
          className="fixed top-2 right-2 z-40 flex items-center gap-2 text-lg cursor-pointer transition"
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-label="Open menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
        >
          <motion.span
            ref={menuTextRef}
            className="text-base"
            initial="initial"
            animate={isOpen ? "hidden" : isHovering ? "hover" : "unhover"}
            variants={menuTextVariants}
          >
            Menu
          </motion.span>
          <TbMenu size={24} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`fixed inset-0 z-50 h-full w-full bg-background/75 text-foreground backdrop-blur-xl p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 transition text-foreground hover:text-primary cursor-pointer"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              tabIndex={0}
            >
              <X size={32} />
            </button>

            {/* Logo */}
            <div className="flex mb-16">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image
                  className="dark:invert"
                  src="/simulasi.svg"
                  alt="Simulasi Studio Logo"
                  width={42}
                  height={42}
                  priority
                />
              </Link>
            </div>

            {/* Menu Content */}
            <motion.div
              variants={menuItemVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="grid w-full max-w-md grid-cols-1 gap-6 text-left sm:max-w-lg sm:grid-cols-2 md:max-w-5xl md:grid-cols-3 lg:grid-cols-4"
            >
              {menuSections.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  className="space-y-3"
                  variants={menuItemVariants}
                >
                  <h3 className="text-lg sm:text-xl font-black">
                    {section.title}
                  </h3>
                  <ul className="space-y-1 sm:space-y-2">
                    {section.items.map((item) => (
                      <motion.li
                        key={item.name}
                        variants={menuItemVariants}
                        className="cursor-pointer text-base  sm:text-lg relative group" // Add group here
                        tabIndex={0}
                      >
                        {item.isExternal ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="relative z-10" // Add relative and z-index
                          >
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-foreground group-hover:w-full transition-all duration-300"></span>
                          </a>
                        ) : (
                          <Link
                            href={item.link}
                            onClick={() => setIsOpen(false)}
                            className="relative z-10" // Add relative and z-index
                          >
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-foreground group-hover:w-full transition-all duration-300"></span>
                          </Link>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={socialIconVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="mt-10 flex justify-start space-x-4 sm:space-x-6"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  aria-label={social.name}
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:text-primary"
                  variants={socialIconVariants}
                  tabIndex={0}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>

            <div className="absolute bottom-4 left-0 flex w-full flex-col items-start justify-between p-4 text-sm text-muted-foreground sm:flex-row sm:items-center">
              <span>
                © {new Date().getFullYear()} Simulasi Studio. All rights
                reserved.
              </span>
              <div className="flex space-x-4 group">
                {" "}
                {/* Added group for footer links */}
                <Link
                  href="/privacy-policy"
                  className="relative z-10" // Add relative and z-index
                  onClick={() => setIsOpen(false)}
                  tabIndex={0}
                >
                  Privacy Policy
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-muted-foreground group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/changelog"
                  className="relative z-10" // Add relative and z-index
                  onClick={() => setIsOpen(false)}
                  tabIndex={0}
                >
                  Changelog
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-muted-foreground group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </div>
            <RGBBackground />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
