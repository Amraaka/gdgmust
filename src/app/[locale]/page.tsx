import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import Image from 'next/image';
import FAQ from '@/components/homepage/faq';

import WaveDots from '@/components/homepage/wave';
import Introduction from '@/components/homepage/Introduction';
 
import Title from '@/components/homepage/title';


//Image imports
import intro from "../../../public/images/homepage/intro.jpg";
 
export default function HomePage() {
  const t = useTranslations();
  return (
    <div>
      <section className="">
        <Introduction />
      </section>

      <div className='absolute top-[340px] left-1/2 transform -translate-x-1/2 flex items-center justify-center select-none'>
        {/* <p className='text-[30px] text-center'>Welcome to GDG on Campus MUST</p> */}
      </div>      
      {/* Add the new parallax section */}


      {/* FAQ */}
      <div className='my-10 mb-5'>
        <nav className='flex items-center justify-center text-[32px] font-bold select-none'>
          <p className='text-[#EF4233] '>F</p>
          <p className='text-[#4687FA] '>A</p>
          <p className='text-[#F8AA00] '>Q</p>
        </nav>
        <nav className='mt-5 flex items-center justify-center'>
          <FAQ />
        </nav>
      </div>
{/* 
      <h1>{t('title')}</h1>
      <Link href="/about">{t('about')}</Link> */}
    </div>
  );
}