'use client';

import {useTranslations} from 'next-intl';
 
import { AnimatePresence, motion, useInView } from 'framer-motion';
import * as React from 'react';

export default function Title() {
  const t = useTranslations();
  return (
    <div className="w-full select-none" draggable="false">
    <AnimatePresence>
    {(() => {
        const text = t('HomePage.title');
        const ref = React.useRef(null);
        const isInView = useInView(ref);
        
        return text.split('').map((char: string, i: number) => (
        <motion.p
            ref={i === 0 ? ref : undefined}
            key={i}
            initial={{ opacity: 0, x: -18 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            exit="hidden"
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]"
        >
            {char === ' ' ? <span>&nbsp;</span> : char}
        </motion.p>
        ));
    })()}
    </AnimatePresence>
    </div>
  );
}