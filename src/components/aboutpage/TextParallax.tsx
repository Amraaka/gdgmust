'use client'
import { useScroll, useTransform, motion } from 'framer-motion';
import Picture1 from '../../../public/images/aboutpage/1.jpg'
import Picture2 from '../../../public/images/aboutpage/2.jpg'
import Picture3 from '../../../public/images/aboutpage/3.jpg'
import Lenis from 'lenis';

import Image, { StaticImageData } from 'next/image';
import { useEffect, useRef } from 'react';

import {  useTranslations } from 'next-intl';


import { imageOptimizer } from 'next/dist/server/image-optimizer';

interface SlideProps {
  src: string | StaticImageData;
  direction: 'left' | 'right';
  left: string;
  progress: any;
}

interface PhraseProps {
  src: string | StaticImageData;
}

export default function TextParallax() {
    const container = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'end start']
    });

    useEffect(() => {
        const lenis = new Lenis();

        function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }, []);

    return (
        <main className="overflow-hidden" draggable='false' >
        <div className='h-[100vh]' />
        <div className='' ref={container}>
            <Slide src={Picture1} direction="left" left="-40%" progress={scrollYProgress} />
            <Slide src={Picture2} direction="right" left="-25%" progress={scrollYProgress} />
            <Slide src={Picture3} direction="left" left="-75%" progress={scrollYProgress} />
        </div>
        {/* <div className='h-[100vh]' /> */}
        </main>
    );
    }

const Slide: React.FC<SlideProps> = ({ src, direction, left, progress }) => {
  const translateX = useTransform(progress, [0, 1], [150 * (direction === 'left' ? -1 : 1), -150 * (direction === 'left' ? -1 : 1)]);
  
  return (
    <motion.div style={{ x: translateX, left }} className="relative flex whitespace-nowrap">
      <Phrase src={src} />
      <Phrase src={src} />
      <Phrase src={src} />
    </motion.div>
  );
}

const Phrase: React.FC<PhraseProps> = ({ src }) => {
    const t = useTranslations();
    return (
        <div className="px-5 flex gap-5 items-center">
        <p className="text-[7.5vw] select-none">{t('AboutPage.TextParallax')}</p>
        <span className="relative h-[7.5vw] aspect-[4/2] rounded-full overflow-hidden">
            <Image 
                style={{ objectFit: "cover" }} 
                draggable="false"
                className="select-none"
                src={src} 
                alt="image" 
                fill 
                // sizes="(max-width: 768px) 15vw, 7.5vw"
                sizes="(max-width: 768px) 15vw, 50vw" 
            />
        </span>
        </div>
    );
}