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
            alt="404 - Page Not Found"
            width={1030}
            height={579}
            className=""
            draggable="false"
          />
        </div>
        <div className="flex justify-center mt-[54px]">
          <p 
            className="lg:text-[40px] text-3xl font-bold">
            Oops... Page not found!
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center mt-12 select-none">
          <Link
            href={homeItem.anchor}
            className="flex items-center justify-center lg:px-6 lg:py-3 px-4 py-2 rounded-full text-[15px] mt-5 mb-9 md:mt-1 md:mb-9 lg:mt-1 lg:mb-9 bg-white outline-none outline-1 outline-black hover:bg-gray-100 transition-colors select-none duration-300"
            draggable="false"
          >
            <span>Back to {homeItem.label} page</span>
          </Link>
        </div>
      </div>
    );
  }