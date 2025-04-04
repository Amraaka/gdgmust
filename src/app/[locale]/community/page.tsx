import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

import Image from 'next/image';
import background from '../../../../public/images/community/background.png';
import logo from '../../../../public/images/community/logo.svg';
import discord from '../../../../public/images/community/discord.svg';

import SearchBar from '@/components/utils/searchbar1';
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

import "@/styles/globals.css";
 
export default function CommunityPage() {
  const t = useTranslations();
  
  return (
    <div className="">
      {/* Background */}
      <div className="flex justify-center overflow-hidden select-none">
        <div style={{ position: 'relative', height: '692px', width: '1562px', maxWidth: '100vw' }}>
          <Image
            src={background}
            alt="Background"
            fill
            sizes="100vw"
            className="object-cover"
            draggable="false"
            priority
          />
        </div>
      </div>

      {/* Logo */}
      <div className="absolute top-[116px] left-1/2 transform -translate-x-1/2 flex items-center justify-center select-none md:size-max lg:size-max size-[300px]">
        <Image
          src={logo}
          alt="Logo"
          className=''
          draggable="false"
        />
      </div>

      {/* <SearchBar /> */}
        <div className="absolute top-[116px] left-1/2 transform -translate-x-1/2 flex items-center justify-center lg:mt-[438px] md:mt-[438px] mt-[388px]">
          <SearchBar />
        </div>


      {/* The member's section */}
      {/* title */}
      <div className='flex justify-center items-center flex-col mt-10 text-center max-w-2xl mx-auto px-4 pb-8'>
        <p className='text-[25px] font-semi md:text-[34px] lg:text-[36px] mb-[10px]'>{t('CommunityPage.header.title')}</p>
        <p className='text-[16px] max-w-[600px] md:text-[18px] lg:text-[18px] leading-4 md:leading-5 lg:leading-5'>{t('CommunityPage.header.description')}</p>
      </div>


      {/* Select a year FILTER */}
      <nav className='flex justify-center items-center mt-1' draggable="false">
        <button className='flex justify-center item-center select-none bg-white border border-black rounded-full px-5 h-[42px]'>
          <a className='mt-[7px] text-[17px]'>{t('CommunityPage.selectyear')}</a> 
          <IoMenu className='ml-[10px] mt-[10px] size-5' />
        </button>
      </nav>


      {/* Role of Member FILTER */}
      <nav className='flex justify-center items-center mt-4 flex-col md:flex-row lg:flex-row' draggable="false">
        <nav className='p-1 -pr-1 md:pr-2 lg:pr-2'>
        <button className='flex justify-center item-center select-none bg-[#EDEDED] rounded-full px-4 h-[42px]'>
          <a className='mt-[8px] text-[17px]'>{t('CommunityPage.filter.seeAll')}</a> 
        </button>
        </nav>

        <nav className='p-1'>
        <button className='flex justify-center item-center select-none bg-[#EDEDED] rounded-full px-4 h-[42px]'>
          <a className='mt-[8px] text-[17px]'>{t('CommunityPage.filter.1')}</a> 
        </button>
        </nav>

        <nav className='p-1'>
        <button className='flex justify-center item-center select-none bg-[#EDEDED] rounded-full px-4 h-[42px]'>
          <a className='mt-[8px] text-[17px]'>{t('CommunityPage.filter.2')}</a> 
        </button>
        </nav>
        
        <nav className='p-1'>
        <button className='flex justify-center item-center select-none bg-[#EDEDED] rounded-full px-4 h-[42px]'>
          <a className='mt-[8px] text-[17px]'>{t('CommunityPage.filter.3')}</a> 
        </button>
        </nav>
        
        <nav className='p-1'>
        <button className='flex justify-center item-center select-none bg-[#EDEDED] rounded-full px-4 h-[42px]'>
          <a className='mt-[8px] text-[17px]'>{t('CommunityPage.filter.4')}</a> 
        </button>
        </nav>

        <nav className='p-1'>
        <button className='flex justify-center item-center select-none bg-[#EDEDED] rounded-full px-4 h-[42px]'>
          <a className='mt-[8px] text-[17px]'>{t('CommunityPage.filter.5')}</a> 
        </button>
        </nav>
      </nav>
  
          

      {/* Do you want to join our community? */}
      <div className=''>
        {/* texts */}
        <div className='flex justify-center items-center flex-col mt-10 text-center max-w-2xl mx-auto px-4 pb-10'>
          <p className='text-[22px] font-semi md:text-[34px] lg:text-[36px] mb-[10px]'>{t('CommunityPage.JoinUs.title')}</p>
          <p className='text-[16px] max-w-[600px] md:text-[18px] lg:text-[18px] leading-4 md:leading-5 lg:leading-5'>{t('CommunityPage.JoinUs.description')}</p>
        </div>

        {/* Buttons */}
        <nav 
        className='flex flex-col lg:flex-row justify-center items-center select-none -mt-2 md:mt-3 lg:mt-3'
        draggable="false"
        >
          <a
            className='bg-[#00AAFF] w-[220px] lg:w-[213px] h-[38px] lg:h-[42px] flex items-center justify-center rounded-full m-1 hover:scale-100 lg:hover:scale-105 transition-all duration-300 cursor-not-allowed disabled'
            href="https://docs.google.com/forms/d/e/1FAIpQLSdZgt6RQUF06YgprYDJY65eeljhJdJPVyGijF7P-vAKvoTu8A/closedform"
            draggable="false"
            target="_blank" 
            rel="noopener noreferrer"
            
          >
            <p className='text-white text-[16px] md:text-[17px] lg:text-[17px]'>{t('CommunityPage.JoinUs.buttonJoin')}</p>
          </a>

          <a
            className='bg-[#5865F2] w-[220px] lg:w-[239px] h-[38px] lg:h-[42px] rounded-full flex items-center justify-center m-1 mt-1 hover:scale-100 lg:hover:scale-105 transition-all duration-300 '
            href="https://discord.gg/YNyzd5D9"
            draggable="false"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <p className='text-white text-[16px] md:text-[17px] lg:text-[17px]'>{t('CommunityPage.JoinUs.buttonDiscord')}</p>
          </a>
        </nav>

        {/* Discord image */}
        <div className='justify-center flex mt-7 md:mt-10 lg:mt-10 mb-12'>
          <Image
            src={discord}
            alt="Discord"
            className="size-[280px] md:size-max lg:size-max"
            draggable="false"
          />
        </div>

      </div>
  </div>
  );
}