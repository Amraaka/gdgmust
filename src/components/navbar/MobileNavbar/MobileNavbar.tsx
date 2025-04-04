import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems } from "../navItems";
import "@/styles/globals.css";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import mn from "../../../../public/images/mn.png";
import us from "../../../../public/images/us.png";

import MobileMenu from "./MobileMenu";

interface MobileNavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Navbar = ({ isMenuOpen, setIsMenuOpen }: MobileNavbarProps) => {
  // Replace local state with props
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();


  // Extract the locale from the current pathname
  const currentLocale = pathname.split("/")[1];

  // Function to switch locale
  const switchLocale = (newLocale: string) => {
    const newPath = `/${newLocale}${pathname.replace(`/${currentLocale}`, "")}`;
    router.push(newPath);
    setIsMenuOpen(false); // Fixed: was setIsOpen
  };
  
  const handleNavigation = (anchor: string) => {
    setIsMenuOpen(false); // Fixed: was setIsOpen
    
    if (anchor.startsWith('#')) {
      // Handle hash/anchor links
      if (anchor === '#') {
        router.push(`/${locale}`);
      } else {
        router.push(`/${locale}${anchor}`);
      }
    } else if (anchor.startsWith('/')) {
      // Handle regular page navigation
      router.push(`/${locale}${anchor}`);
    }
  };

  // Function to check if a menu item is active
  const isActive = (anchor: string) => {
    if (anchor === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    } else if (anchor.startsWith('#')) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    } else {
      return pathname === `/${locale}${anchor}`;
    }
  };

  // Get the "Other" subitems
  const otherSubItems = navItems.find((n) => n.label === "Other")?.subItems || [];

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 350,
        damping: 30,
        mass: 0.8
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.05,
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    })
  };

  return (
    <>
    {/* Fullscreen backdrop blur */}
    {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md" 
          style={{ zIndex: 40 }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    
    {/* Menu content */}
    <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-x-0 bottom-0 flex justify-center items-end pb-[75px] z-[60] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/90 rounded-3xl p-6 w-[200px] shadow-lg border border-gray-200 pointer-events-auto"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ul className="space-y-4 text-center select-none">
                {/* Show all items except "Other" */}
                {navItems
                  .filter(item => item.label !== "Other")
                  .map((item, i) => (
                    <motion.li 
                      key={item.label}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.button 
                        onClick={() => handleNavigation(item.anchor)}
                        // id={`${isActive(item.anchor) ? 'font-gbold' : 'font-g-regular'}`}
                        className={`w-full py-2 px-4 rounded-lg transition-colors ${
                          isActive(item.anchor) ? 'bg-black/5 font-bold' : 'font-regular'
                        }`}
                        whileHover={{ 
                          backgroundColor: "rgba(0,0,0,0.06)", 
                          scale: 1.02 
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item.label}
                      </motion.button>
                    </motion.li>
                ))}
                
                {/* Show "Other" subitems directly */}
                {otherSubItems.map((sub, i) => (
                  <motion.li 
                    key={sub.label}
                    custom={i + navItems.filter(item => item.label !== "Other").length}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.button 
                      onClick={() => handleNavigation(sub.anchor)}
                      
                      className={`w-full py-2 px-4 rounded-lg transition-colors select-none ${
                        isActive(sub.anchor) ? 'bg-black/5 font-bold' : 'font-regular'
                      }`}
                      whileHover={{ 
                        backgroundColor: "rgba(0,0,0,0.06)", 
                        scale: 1.02 
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {sub.label}
                    </motion.button>
                  </motion.li>
                ))}
                
                {/* Language Toggle Section */}
                <motion.li 
                  className="pt-2"
                  custom={navItems.length + otherSubItems.length}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="border-t border-gray-200 pt-4 flex justify-center">
                    <div className="flex items-center justify-between gap-4 select-none">
                      <motion.button
                        onClick={() => switchLocale("mn")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Image
                          src={mn}
                          alt="Mongolian Flag"
                          width={25}
                          height={25}
                          draggable="false"
                          className={`rounded-full transition-all duration-300 ${
                            currentLocale === "mn" ? "saturate-100 scale-110" : "saturate-[0%] scale-[70%] opacity-[70%]"
                          }`}
                        />
                      </motion.button>
                      
                      <div className="w-[1px] h-5 bg-black"></div>
                      
                      <motion.button
                        onClick={() => switchLocale("en")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Image
                          src={us}
                          alt="US Flag"
                          width={25}
                          height={25}
                          draggable="false"
                          className={`rounded-full transition-all duration-300 ${
                            currentLocale === "en" ? "saturate-100 scale-110" : "saturate-[0%] scale-[70%] opacity-[70%]"
                          }`}
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.li>
              </ul>
              </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    {/* Navigation bar with menu button */}
    <nav className="bg-white/95 backdrop-blur-md outline-none outline-1 outline-black/60 flex justify-center items-center outline-offset-0 rounded-full p-4 fixed bottom-[20px] left-1/2 transform -translate-x-1/2 w-[100px] h-[40px] select-none z-50">
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)} // Fixed: was setIsOpen(!isOpen)
      className="px-7 py-5 rounded text-black font-bold"
    >
      {isMenuOpen ? "CLOSE" : "MENU"} {/* Fixed: was isOpen */}
    </button>
    </nav>
  </>
);
};

export default Navbar;