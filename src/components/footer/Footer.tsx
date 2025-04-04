import React from "react";
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "@/styles/globals.css";

import Image from "next/image";
import pixelHeart from "../../../public/images/footer/pixelHeart.png";

const Footer = () => {
  return (
    <div draggable="false" className="w-full flex flex-col items-center pt-[69px] pb-[100px] lg:pb-[78px] md:pb-[100px] sm:pb-[100px] px-5 md:px-10 bg-[#F6F6F6] select-none">
      <div className="w-full max-w-[1300px] flex flex-col lg:flex-row justify-between items-center text-center lg:text-left">
        {/* Left Section */}
        <div className="text-black text-lg md:text-xl lg:text-[20px] font-medium max-w-[314px]">
          <p className="leading-[1.24]" draggable="false" id="">
          Google Developer Groups (GDG) on Campus at Mongolian University of Science and Technology
          </p>
        </div>
        
        {/* Right Section */}
        <div className="flex flex-col items-center lg:items-end mt-8 lg:mt-0" draggable="false">
          <div className="flex space-x-4 text-[23px]" draggable="false">
            <a href="https://www.facebook.com/gdgcmust/" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="lg:hover:text-gray-500 md:hover:text-gray-500" />
            </a>
            <a href="https://www.instagram.com/gdg.must/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-[24px]  lg:hover:text-gray-500 md:hover:text-gray-500" />
            </a>
            <a href="https://www.linkedin.com/company/gdg-on-campus-mongolian-university-of-science-and-technology/" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className=" lg:hover:text-gray-500 md:hover:text-gray-500 text-[24px]" />
            </a>
          </div> 
          <div className="mt-6 lg:mt-0 md:mt-6 sm:mt-6 text-center lg:text-right" draggable="false">
            <p className="text-[19px] mt-2">Ulaanbaatar, Mongolia</p>
            <p className="text-[15px] -mt-[6px] flex items-center justify-end">
              Made with <Image src={pixelHeart} alt="Pixel Heart" width={15} height={15} draggable="false" className="mx-1 select-none"/> in UB © 2025
            </p>
            <p className="text-[14px] -mt-[6.5px]">Developed by <a href="https://www.instagram.com/roaziy/" target="_blank" rel="noopener noreferrer"><span className="font-bold" >roaziy</span></a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;