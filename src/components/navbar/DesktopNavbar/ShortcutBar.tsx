import Link from "next/link";
import { useState } from "react";

interface ShortcutBarProps {
  text: string;
  link: string;
}

const ShortcutBar = ({ text, link }: ShortcutBarProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="relative mr-[50px]"
      style={{ userSelect: 'none', cursor: 'pointer' }}
    >
      <Link
        href={link}
        className={`
          flex items-center px-6 py-[12px] rounded-full text-[16px] bg-white outline-none transition-all duration-300
          ${hovered ? 'shadow-xl scale-105' : ''}
        `}
        draggable="false"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="relative z-10 animate-rgb-text">{text}</span>
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent animate-soft-rgb"></div>
      </Link>
      <style jsx>{`
        @keyframes soft-rgb {
          0% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.4); border-color: rgba(255, 0, 0, 0.5); }
          33% { box-shadow: 0 0 14px rgba(0, 255, 0, 0.4); border-color: rgba(0, 255, 0, 0.5); }
          66% { box-shadow: 0 0 14px rgba(0, 0, 255, 0.4); border-color: rgba(0, 0, 255, 0.5); }
          100% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.4); border-color: rgba(255, 0, 0, 0.5); }
        }

        @keyframes rgb-text {
          0% { color: rgb(255, 0, 0, 0.5); }
          33% { color: rgb(0, 255, 0, 0.5); }
          66% { color: rgb(0, 0, 255, 0.5); }
          100% { color: rgb(255, 0, 0, 0.5); }
        }

        .animate-soft-rgb {
          animation: soft-rgb 6s infinite ease-in-out;
        }

        .animate-rgb-text {
          animation: rgb-text 6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ShortcutBar;
