import React from "react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaSpotify,
} from "react-icons/fa";

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
    url: "https://github.com/simulasikode",
    icon: <FaGithub size={24} />,
  },
];

const Footer = () => {
  return (
    <footer
      className="relative h-[480px] -mb-[10px] -mx-[10px] bg-white dark:bg-[#121212]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%" }}
    >
      <div className="relative h-[calc(100vh+480px)] -top-[100vh]">
        <div className="sticky top-[calc(100vh-480px)] h-[480px]">
          <div className="relative h-full w-full flex flex-col justify-between">
            <div className="flex shrink-0">
              <div className="flex flex-col gap-2 mt-10 ml-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    aria-label={social.name}
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <h5 className="font-extrabold text-[12vw] leading-[82%] tracking-tighter mt-10">
                Simulasi Studio
              </h5>
              <p className="text-xs text-foreground mr-2 mb-2">
                © {new Date().getFullYear()} Simulasi Studio. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
