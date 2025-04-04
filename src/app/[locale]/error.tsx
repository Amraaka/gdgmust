'use client';

import Link from "next/link";
import Image from "next/image";
import notfound from "../../../public/images/notfound/notfound.png";

import { useLocale } from 'next-intl';
import { navItems } from "@/components/navbar/navItems";

import "@/styles/globals.css";

export default function NotFound() {
    // Get the first item (Home) from navItems
    const homeItem = navItems[0];
    
    return (
      <div>
        <div className="flex justify-center select-none">
          <Image
            src={notfound}
            alt="400 Error"
            width={1030}
            height={579}
            className=""
            draggable="false"
          />
        </div>
        <div className="flex justify-center mt-[54px]">
          <p 
            className="lg:text-[40px] text-3xl font-bold">
            400 Error!
          </p>
        </div>
      </div>
    );
  }