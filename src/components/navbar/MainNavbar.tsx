'use client';

import { useState, useEffect } from 'react';
import Logobar from "./Logobar";
import LanguageToggle from "./DesktopNavbar/LanguageToggle";
import ShortcutBar from "./DesktopNavbar/ShortcutBar";

import ScrollAwareLogobar from "../utils/ScrollAwareLogobar";

// Navbars
import DesktopNavbar from "./DesktopNavbar/DesktopNavbar";
import MobileNavbar from "./MobileNavbar/MobileNavbar";

import { useLocale } from 'next-intl'

interface ShortcutEnableProps {
    enabled: boolean;
    text: string;
    link: string;
}

// Responsive Navbar component with separate positioning logic
const Navbar = ({ 
    isMobile, 
    isMenuOpen, 
    setIsMenuOpen 
  }: { 
    isMobile: boolean;
    isMenuOpen?: boolean;
    setIsMenuOpen?: (isOpen: boolean) => void;
  }) => {
    if (isMobile) {
      return (
        <>
          <ScrollAwareLogobar />
          {isMenuOpen !== undefined && setIsMenuOpen !== undefined ? (
            <MobileNavbar 
              isMenuOpen={isMenuOpen} 
              setIsMenuOpen={setIsMenuOpen} 
            />
          ) : null}
        </>
      );
    } else {
      // Desktop navbar stays at the top
      return (
        <>
          <Logobar />
          <DesktopNavbar />
          <LanguageToggle />
        </>
      );
    }
  };



const ShortcutEnable = ({ enabled, text, link }: ShortcutEnableProps) => {
    if (enabled) {
        return <ShortcutBar text={text} link={link} />;
    } else {
        return null;
    }
};

export default function MainNavbar() {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [shortcutEnabled] = useState(true);
    const [shortcutText] = useState('Hackathon - Register Now!');
    const locale = useLocale();
    const [shortcutLink] = useState(`/${locale}/events`);

    // State to track if mobile menu is open
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1080);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!mounted) return null;

    // Only apply desktop-specific positioning when not in mobile mode
    return (
        <div className={isMobile ? "" : "my-[28px]"}>
        {isMobile ? (
            // Pass state and setter to child components
            <>
                {!isMobileMenuOpen && <ScrollAwareLogobar />}
                <MobileNavbar 
                    isMenuOpen={isMobileMenuOpen} 
                    setIsMenuOpen={setIsMobileMenuOpen} 
                />
            </>
            ) : (
                // Regular layout for desktop
                <div className="flex items-center justify-between w-full">
                    {/* Centered elements */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-[15px] top-[28px]">
                        <Navbar isMobile={false} />
                    </div>
                    
                    {/* Shortcut button on the right */}
                    <div className="ml-auto">
                        <ShortcutEnable enabled={shortcutEnabled} text={shortcutText} link={shortcutLink} />
                    </div>
                </div>
            )}
        </div>
    );
}