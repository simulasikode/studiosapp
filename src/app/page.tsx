"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";
import Link from "next/link";
import Head from "next/head"; // Import the Head component

const CaseStudies = dynamic(() => import("@/components/CaseStudies"), {
  ssr: false,
});

const PrePress = dynamic(() => import("@/components/PrePress"), {
  ssr: false,
});

// Custom hook for intersection observer
const useSectionInView = (threshold = 0.5) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold,
  });

  return { ref, inView };
};

// Custom hook for parallax effect
const useParallax = (
  inputRange = [0, 1],
  outputRange = ["0%", "-10%"],
  duration = 0.4, // Add a duration prop
) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const parallaxValue = useTransform(scrollYProgress, inputRange, outputRange);

  return { ref, parallaxValue, duration }; // Return duration
};

// Reusable Hero Section Component
const HeroSection = () => {
  const {
    ref: heroRef,
    parallaxValue: parallaxHeadingY,
    duration: headingDuration,
  } = useParallax([0, 1], ["0%", "10%"], 0.6); // Customize duration
  const { parallaxValue: parallaxHeadingOpacity } = useParallax(
    [0, 0.5],
    ["1", "0"],
  );
  const { ref: parallaxRef, parallaxValue: parallaxBg } = useParallax();

  const subheading =
    "Crafting Prints and Digital Tools: PressPrice and Color Process Calculator";

  return (
    <div ref={parallaxRef} style={{ transform: `translateY(${parallaxBg})` }}>
      <section className="relative top-48 max-w-5xl mx-auto min-h-[100vh] flex flex-col items-center text-center bg-background overflow-hidden px-4 md:px-6 lg:px-8">
        <motion.h1
          ref={heroRef}
          style={{ y: parallaxHeadingY, opacity: parallaxHeadingOpacity }}
          transition={{ duration: headingDuration }} // Use the duration
          className="uppercase text-2xl sm:text-3xl md:text-4xl lg:text-[72px] leading-[82%] tracking-tighter font-black"
        >
          Simulasi: Screen printing <p>Studio & Service</p>{" "}
        </motion.h1>
        <motion.h2
          style={{ opacity: parallaxHeadingOpacity }}
          className=" mt-6 text-bold text-[16px] md:text-[20px] leading-normal md:leading-[96%] text-muted-foreground uppercase"
        >
          {subheading.split(": ")[0]}:{" "}
          <Link
            href={"/press-price"}
            className="relative bg-[#00FFFF] text-primary dark:text-background border border-background hover:border-primary rounded-full py-1 px-3"
          >
            {subheading.split(": ")[1].split(" and ")[0]}
          </Link>{" "}
          and{" "}
          <Link
            href={"/color-process"}
            className="bg-[#FF00FF]  border border-background hover:border-primary rounded-full py-1 px-3"
          >
            {subheading.split(": ")[1].split(" and ")[1]}
          </Link>{" "}
        </motion.h2>
      </section>
    </div>
  );
};

// Reusable Text Section Component (Staggering)
const TextSection = () => {
  const { ref: textSectionRef, inView: textSectionInView } =
    useSectionInView(0.3);
  const {
    ref: textRef,
    parallaxValue: parallaxText,
    duration,
  } = useParallax([0, 1], ["0%", "-22%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration, // Use the custom duration
        ease: "easeInOut",
      },
    },
  };

  const paragraphs = [
    "There are many questions about the screen printing process because each step introduces unique complexities, including working with opaque and transparent inks and the interaction between ink and paper. Screen printing has intrinsic qualities that allow the technique to offer countless effects beyond simply creating an exceptional print.",
    "Mastering the screen printing process, and thus controlling the outcome of a photo, drawing, poster, or design, requires an ethical approach; this is the key to producing exceptional prints. The artist acts as both conductor and chemist, orchestrating the interplay of variables to achieve a specific vision. This control extends from choosing the right mesh count for the desired level of detail to manipulating ink viscosity for optimal flow and coverage. It's a process of constant learning, experimentation, and refinement.",
    "This practical experience provides basic knowledge that helps develop skills in screen printing. By engaging in hands-on activities, individuals can learn the fundamental techniques and processes involved in this artistic form. This not only enhances their understanding of the materials used but also allows them to experiment with various designs and printing methods. As they practice, they will gain confidence in their ability to create unique prints, fostering creativity and encouraging a deeper appreciation for the craftsmanship involved in screen printing. Overall, this foundational training sets the stage for more advanced explorations in the field, potentially leading to new artistic ventures or career opportunities.",
  ];

  return (
    <section
      ref={textSectionRef}
      className="flex flex-col justify-between items-center min-h-[94vh] md:min-h-[86vh] px-8 md:px-12 lg:px-16"
    >
      {/* Removed absolute positioning */}
      <div className="relative w-full mt-20">
        {" "}
        {/* Added mt-20 for spacing */}
        <motion.div
          ref={textRef}
          style={{ y: parallaxText }}
          initial="hidden"
          animate={textSectionInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="absolute top-0 right-0 w-[68vw] sm:w-[64vw] md:w-[72vw] lg:w-[64vw] xl:w-[72vw] z-10" // Removed absolute positioning
        >
          <motion.h3
            variants={paragraphVariants}
            className="text-2xl md:text-3xl font-bold mb-4"
          >
            A Perfect Blend of Art and Science!
          </motion.h3>
          {paragraphs.map((text, index) => (
            <motion.p
              key={index}
              variants={paragraphVariants}
              className={`text-sm md:text-lg lg:text-xl leading-normal ${
                index > 0 ? "mt-4" : ""
              }`}
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default function Home() {
  const scrollRef = useRef(null);
  const screenPrintingTextRef = useRef(null);

  const tagline = "Simulasi Studio: Art Print Services & Tools";
  const subheading =
    "Crafting Prints and Digital Tools: PressPrice and Color Process Calculator";

  const OPACITY_FADE_START = 0.2;
  const OPACITY_FADE_END = 0.8;

  const { scrollYProgress } = useScroll({
    target: screenPrintingTextRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, OPACITY_FADE_START, OPACITY_FADE_END, 1],
    [1, 1, 0, 0],
  );

  return (
    <div ref={scrollRef}>
      <Head>
        <title>{tagline} | Screen Printing & Digital Tools</title>{" "}
        {/* Use tagline in title */}
        <meta
          name="description"
          content={
            subheading +
            " - Expert screen printing services and online calculators for artists and creators."
          }
        />{" "}
        {/* Use subheading + more */}
        <meta
          name="keywords"
          content="art print, fine art, screen printing, digital tools, press price, color process calculator, simulasi studio, printing services"
        />
      </Head>
      <main className="relative">
        <HeroSection />
        <div className="sticky bottom-6 left-0">
          <motion.p
            ref={screenPrintingTextRef}
            style={{ opacity }}
            className="text-xs font-regular w-[20vw] sm:w-[20vw] md:w-[16vw] lg:w-[60vw] xl:w-[15vw] leading-[92%]"
          >
            Our focus in the studio is creating art prints and developing
            digital tools.{" "}
          </motion.p>
        </div>
        <TextSection />
        <CaseStudies />
        <PrePress />
      </main>
    </div>
  );
}
