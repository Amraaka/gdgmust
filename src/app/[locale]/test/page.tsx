"use client";

import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import { Rubik_Mono_One } from "next/font/google";

const rubikMonoOne = Rubik_Mono_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const TextSpinnerLoader: React.FC = () => {
  const text = "LOADING... PLEASE WAIT...";
  const characters = text.split("");

  const radius = 69;
  const fontSize = "18px";
  const letterSpacing = 12.5;

  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animateLoader = async () => {
      const letterAnimation: [string, object, object][] = [];
      characters.forEach((_, i) => {
        letterAnimation.push([
          `.letter-${i}`,
          { opacity: 0 },
          { duration: 0.3, ease: "linear", at: i === 0 ? "+0.8" : "-0.28" },
        ]);
      });
      characters.forEach((_, i) => {
        letterAnimation.push([
          `.letter-${i}`,
          { opacity: 1 },
          { duration: 0.3, ease: "linear", at: i === 0 ? "+0.8" : "-0.28" },
        ]);
      });
      animate(letterAnimation, undefined, {
        repeat: Infinity,
      });
      animate(
        scope.current,
        { rotate: 360 },
        { duration: 4, ease: "linear", repeat: Infinity }
      );
    };
    animateLoader();
  }, [animate, characters, scope]);
  

  return (
    <div className="flex justify-center items-center h-screen">
    <motion.div
      ref={scope}
      className="relative aspect-square"
      style={{ width: radius * 2 }}
    >
      <p aria-label={text} />
      <p aria-hidden="true" className={rubikMonoOne.className}>
        {characters.map((ch, i) => (
          <motion.span
            key={i}
            className={`letter-${i} absolute top-0 left-1/2 text-neutral-300`}
            style={{
              transformOrigin: `0 ${radius}px`,
              transform: `rotate(${i * letterSpacing}deg)`,
              fontSize,
            }}
          >
            {ch}
          </motion.span>
        ))}
      </p>
    </motion.div>
    </div>
  );
};

export default TextSpinnerLoader;
