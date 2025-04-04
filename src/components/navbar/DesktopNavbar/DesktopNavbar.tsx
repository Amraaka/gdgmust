'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { navItems } from "../navItems";

import { pauseThreeJsAnimations, resumeThreeJsAnimations } from '@/components/homepage/wave';

export default function Navbar() {
    const locale = useLocale();
    const [selected, setSelected] = useState<number | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const pathname = usePathname();
    const router = useRouter();

    const widths = [80, 85, 110, 85, 82];
    const positions = [4, 77, 159, 267, 345];

    const handleMenuOpen = () => {
        pauseThreeJsAnimations();
        // existing menu open logic
      };
      
      const handleMenuClose = () => {
        resumeThreeJsAnimations();
        // existing menu close logic
      };    

    useEffect(() => {
        let index = navItems.findIndex(item => pathname.toLowerCase().includes(item.label.toLowerCase()));
        if (pathname === `/${locale}/` || pathname === `/${locale}`) {
            index = 0;
        }
        setSelected(index !== -1 ? index : 4);
    }, [pathname]);

    const handleMouseEnter = (index: number) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setHovered(index);
        if (navItems[index].subItems.length > 0) setIsSubmenuOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setHovered(null);
            setIsSubmenuOpen(false);
        }, 200);
    };

    const handleNavbarMouseEnter = (index: number) => {
        if (index !== 4) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setHovered(null);
            setIsSubmenuOpen(false);
        }
    };

    return (
        <div>
            <div className="relative flex items-center bg-white/85 px-2 h-[48px] rounded-full shadow-[0px_1px_7px] shadow-gray-300/80 backdrop-blur-md">
            {/* outline-none outline-[1px] outline-black outline-offset-0 */}
                {selected !== null && (
                    <motion.div
                        className="absolute rounded-full bg-[#dadada]"
                        initial={false}
                        animate={{ left: positions[selected] }}
                        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                        style={{
                            width: `${widths[selected] || 80}px`,
                            height: '40px',
                            left: positions[selected],
                        }}
                    />
                )}

                {navItems.map((item, index) => (
                    <div
                        key={item.label}
                        className="relative"
                        onMouseEnter={() => {
                            handleMouseEnter(index);
                            handleNavbarMouseEnter(index);
                        }}
                        onMouseLeave={handleMouseLeave}
                    >
                        <motion.button
                            className={`relative z-10 px-4 py-2 text-[16px] transition-colors select-none ${
                                selected === index ? 'text-black' : 'text-gray-500 hover:text-black'
                            }`}
                            onClick={(e) => {
                                e.preventDefault();
                                setSelected(index);
                                router.replace(`/${locale}${item.anchor}`);
                            }}
                            disabled={index===4}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 17 
                            }}
                        >
                            {item.label}
                        </motion.button>

                        {/* Submenu with AnimatePresence for proper exit animations */}
                        <AnimatePresence>
                            {item.subItems.length > 0 && (hovered === index || isSubmenuOpen) && (
                                <motion.div
                                    id={`submenu-${index}`}
                                    className="absolute -left-[10px] mt-4 bg-white rounded-2xl border shadow-[0px_1px_7px] backdrop-blur-md shadow-gray-300/80 py-1 min-w-[124px] z-50 overflow-hidden select-none"
                                    initial={{ opacity: 0, y: -10, scale: 0.95, transformOrigin: "top center" }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 25,
                                    }}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <motion.div className="py-1 px-1">
                                        {item.subItems.map((sub, subIndex) => (
                                            <motion.button
                                                key={sub.label}
                                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-black/5 transition-all whitespace-nowrap flex items-center select-none"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setHovered(null);
                                                    setIsSubmenuOpen(false);
                                                    router.replace(`/${locale}${sub.anchor}`);
                                                }}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ 
                                                    delay: 0.03 * subIndex,
                                                    duration: 0.2,
                                                }}
                                                whileHover={{ 
                                                    backgroundColor: "rgba(0,0,0,0.06)", 
                                                    scale: 1.02 
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {sub.label}
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}