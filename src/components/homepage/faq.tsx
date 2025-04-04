"use client"

import {useTranslations} from 'next-intl';
import { useState } from 'react';


export default function FAQ() {
    const t = useTranslations();
    
    const [openItem, setOpenItem] = useState<string | null>(null);
    
    const toggleItem = (item: string) => {
      setOpenItem(openItem === item ? null : item);
    };
    
    return (
        <div>
          <div className='items-center flex-col px-4'>
            <div className="w-[320px] md:w-[500px] lg:w-[750px]">

            {/* item1 */}
              <div className="border border-gray-200 rounded-[30px] px-6 my-2">
                <button 
                  className="w-full flex justify-between items-center py-4 text-[16px] text-left  md:text-[18px] lg:text-[18px] font-bold"
                  onClick={() => toggleItem('item-1')}
                  aria-expanded={openItem === 'item-1'}
                >
                  <p className='w-[230px] md:w-full lg:w-full'>{t('HomePage.FAQ.question1')}</p>
                  <svg 
                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                    className={`transition-transform ${openItem === 'item-1' ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all ${openItem === 'item-1' ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                  <div className="text-left w-[250px] md:w-full lg:w-full text-[14px] md:text-[16px] lg:text-[16px]">
                    {t('HomePage.FAQ.answer1')}
                  </div>
                </div>
              </div>
            
            {/* item2 */}
              <div className="border border-gray-200 rounded-[30px] px-6 my-2">
                <button 
                  className="w-full flex justify-between items-center py-4 text-left text-[16px]md:text-[18px] lg:text-[18px] font-bold"
                  onClick={() => toggleItem('item-2')}
                  aria-expanded={openItem === 'item-2'}
                >
                  <p className='w-[230px] md:w-full lg:w-full'>{t('HomePage.FAQ.question2')}</p>
                  <svg 
                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                    className={`transition-transform ${openItem === 'item-2' ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all ${openItem === 'item-2' ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                  <div className="text-left w-[250px] md:w-full lg:w-full text-[14px] md:text-[16px] lg:text-[16px]">
                    {t('HomePage.FAQ.answer2')}
                  </div>
                </div>
              </div>

            {/* item3 */}
            <div className="border border-gray-200 rounded-[30px] px-6 my-2">
                <button 
                  className="w-full flex justify-between items-center py-4 text-left text-[16px]md:text-[18px] lg:text-[18px] font-bold"
                  onClick={() => toggleItem('item-3')}
                  aria-expanded={openItem === 'item-3'}
                >
                  <p className='w-[230px] md:w-full lg:w-full'>{t('HomePage.FAQ.question3')}</p>
                  <svg 
                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                    className={`transition-transform ${openItem === 'item-3' ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all ${openItem === 'item-3' ? 'max-h-60 pb-4' : 'max-h-0'}`}>
                  <div className="text-left w-[250px] md:w-full lg:w-full text-[14px] md:text-[16px] lg:text-[16px]">
                    {t('HomePage.FAQ.answer3')}
                  </div>
                </div>
              </div>

            {/* item4 */}
            <div className="border border-gray-200 rounded-[30px] px-6 my-2">
                <button 
                  className="w-full flex justify-between items-center py-4 text-left text-[16px]md:text-[18px] lg:text-[18px] font-bold"
                  onClick={() => toggleItem('item-4')}
                  aria-expanded={openItem === 'item-4'}
                >
                  <p className='w-[230px] md:w-full lg:w-full'>{t('HomePage.FAQ.question4')}</p>
                  <svg 
                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                    className={`transition-transform ${openItem === 'item-4' ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all ${openItem === 'item-4' ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                  <div className="text-left w-[250px] md:w-full lg:w-full text-[14px] md:text-[16px] lg:text-[16px]">
                    {t('HomePage.FAQ.answer4')}
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    );
}