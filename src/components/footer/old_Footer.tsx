import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import "../../styles/globals.css";

const Footer: React.FC = () => {
  return (
    <div className="w-full bg-neutral-100 flex flex-col items-center py-[80px] md:py-[70px] sm:py-[60px] px-5 md:px-10 select-none">
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full max-w-[1300px]">
        {/* Left Section - Text and Socials */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-[500px]">
        <p className="text-black text-[22px] sm:text-[22px] md:text-[23px] lg:text-[26px] font-medium leading-[1.3] md:leading-[1.4] lg:leading-[1.14] max-w-[450px] md:text-center lg:text-left">

            Google Developer Groups (GDG) on Campus at Mongolian University of Science and Technology
            </p>
            <div className="flex space-x-4 mt-14 lg:mt-20 md:mt-14 sm:mt-14">
            <a href="https://www.facebook.com/gdgcmust/" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-[24px] lg:hover:text-gray-500 md:hover:text-gray-500" />
            </a>
            <a href="https://www.instagram.com/gdg.must/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-[25px] lg:hover:text-gray-500 md:hover:text-gray-500" />
            </a>
            <a href="https://www.linkedin.com/company/gdg-on-campus-mongolian-university-of-science-and-technology/" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="text-[24px] lg:hover:text-gray-500 md:hover:text-gray-500" />
            </a>
            </div>
          <p className="text-[22px] mt-2">Ulaanbaatar, Mongolia</p>
          <p className="text-[14px] mt">
            Made with <span className="text-red-500">❤</span> in UB © 2025 | v1.0
          </p>
          {/* <p className="text-[14px] -mt-0.5">
            Designed by <span className="font-bold">roaziy</span> & <span className="font-bold">Telmen</span>
          </p> */}
            <p className="text-[14px] -mt-0.5">
            Developed by <a href="https://www.instagram.com/roaziy/" target="_blank" rel="noopener noreferrer"><span className="" id="font-gbold">roaziy</span> </a>
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-full max-w-[500px] mt-14 lg:mt-0 md:mt-14 sm:mt-14
        mb-14 lg:mb-0 md:mb-15 sm:mb-3">
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="Your name:"
              className="w-full lg:w-[40%] h-[50px] bg-white border border-black rounded-full px-4 text-[#5e5e5e] text-base"
            />
            <input
              type="email"
              placeholder="Email address:"
              className="w-full lg:w-[60%] h-[50px] bg-white border border-black rounded-full px-4 text-[#5e5e5e] text-base"
            />
          </div>
          <textarea
            placeholder="Message:"
            className="w-full h-[220px] mt-4 bg-white border border-black rounded-[25px] p-4 text-[#5e5e5e] text-base resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Footer;
