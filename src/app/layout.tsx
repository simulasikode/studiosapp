import type { Metadata } from "next";
import "./globals.css";
import Menu from "@/components/Menu";
import { GoogleTagManager } from "@next/third-parties/google";
import GoogleAnalytics from "@/utils/GoogleAnalytics";
import Footer from "@/components/Footer";
import SmoothScrolling from "@/components/SmoothScrolling";
import { validate } from "jsonschema"; // Import the validator
import type { Viewport } from "next";
import Head from "next/head";
import { IBM_Plex_Sans } from "next/font/google";

// --- Font Setup (using next/font) ---
const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"], // Important for performance
  weight: ["100", "200", "300", "400", "500", "600", "700"], // Include all weights you will use
  variable: "--font-ibm-plex", // Define a CSS variable (optional, but good practice)
  display: "swap", // Recommended for performance
});
// --- End Font Setup ---

interface LocaleConfig {
  [locale: string]: {
    href: string;
  };
}

const locales: LocaleConfig = {
  en: { href: "/en" },
  es: { href: "/es" },
  "en-GB": { href: "/en-GB" },
  "x-default": { href: "/" }, // Fallback
};

// JSON Schema for Metadata
const metadataSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    keywords: { type: "array", items: { type: "string" } },
    authors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          url: { type: "string", format: "uri" }, // Optional URL
        },
        required: ["name"],
      },
    },
    viewport: {
      type: "object",
      properties: {
        width: { type: "string" },
        initialScale: { type: "number" },
        maximumScale: { type: "number" },
      },
      required: ["width", "initialScale"],
    },
    openGraph: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        url: { type: "string", format: "url" },
        siteName: { type: "string" },
        images: {
          type: "array",
          items: {
            type: "object",
            properties: {
              url: { type: "string", format: "url" },
              width: { type: "integer" },
              height: { type: "integer" },
              alt: { type: "string" },
            },
            required: ["url", "width", "height", "alt"],
          },
        },
        locale: { type: "string" },
        type: { type: "string" },
      },
      required: [
        "title",
        "description",
        "url",
        "siteName",
        "images",
        "locale",
        "type",
      ],
    },
    robots: {
      type: "object",
      properties: {
        index: { type: "boolean" },
        follow: { type: "boolean" },
        googleBot: {
          type: "object",
          properties: {
            index: { type: "boolean" },
            follow: { type: "boolean" },
          },
          required: ["index", "follow"],
        },
      },
      required: ["index", "follow", "googleBot"],
    },
    alternates: {
      type: "object",
      properties: {
        canonical: { type: "string", format: "url" },
      },
      required: ["canonical"],
    },
  },
  required: ["title", "description"], // Minimum required fields
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

const myMetadata: Metadata = {
  title: "Simulasi - Screen Printing Studio ",
  description:
    "Transform your vision into a vibrant reality at Simulasi Studio. We specialize in high-quality screen printing services for posters and art prints. Our expert printers masterfully utilize techniques like halftone and diffusion dither to create stunning detail and smooth gradients. From bold graphics to intricate designs, we bring your artwork to life with exceptional precision and color accuracy. Get a quote today!",
  keywords: [
    "Screen printing",
    "Screen printing Studio",
    "Screen printing studio near me",
    "digital tools",
    "Estimation price",
    "color process",
    "calculator",
    "art print",
    "poster",
    "fine art",
    "sablon terdekat",
  ],
  authors: [{ name: "M Fahriza Ansyari", url: "https://simulasi.studio" }],
  openGraph: {
    title: "Simulasi - Screen Printing Studio",
    description:
      "Transform your vision into a vibrant reality at Simulasi Studio. We specialize in high-quality screen printing services for posters and art prints. Our expert printers masterfully utilize techniques like halftone and diffusion dither to create stunning detail and smooth gradients. From bold graphics to intricate designs, we bring your artwork to life with exceptional precision and color accuracy. Get a quote today!",
    url: "https://Simulasi.studio",
    siteName: "Simulasi Studio",
    images: [
      {
        url: "https://simulasi.studio/images/simulasi-studio.png",
        width: 1200,
        height: 630,
        alt: "Screen printing poster",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulasi - Screen Printing Studio",
    description:
      "Transform your vision into a vibrant reality at Simulasi Studio. We specialize in high-quality screen printing services for posters and art prints.",
    images: ["https://simulasi.studio/images/simulasi-studio.png"], // Use your og-image.png
  },
  alternates: {
    canonical: "https://simulasi.studio",
  },
};

// Validate the metadata
const validationResult = validate(myMetadata, metadataSchema);

if (!validationResult.valid) {
  console.error("Metadata validation errors:", validationResult.errors);
  // You could throw an error here to stop the build process if the metadata is invalid.
  // throw new Error("Invalid metadata");
  // Or, log the errors and continue, depending on your needs.
}

export const metadata: Metadata = myMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <Head>
        {Object.entries(locales).map(([locale, { href }]) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={`${process.env.NEXT_PUBLIC_BASE_URL}${href}`}
          />
        ))}
      </Head>
      <GoogleAnalytics />
      <body
        className={`${ibmPlex.className} antialiased min-h-[100vh] p-[10px]`}
      >
        <SmoothScrolling>
          <nav>
            <Menu />
          </nav>
          <main>{children}</main>
          <GoogleTagManager gtmId="GTM-PCWP9Z52" />
          <footer>
            <Footer />
          </footer>
        </SmoothScrolling>
      </body>
    </html>
  );
}
