import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import MainNavbar from "../../components/navbar/MainNavbar";
import Footer from "../../components/footer/Footer";
import type { Metadata } from "next";
import "../../styles/globals.css";

// import CustomCursor from '@/components/utils/CustomCursor/CustomCursor'; 

import {notFound} from 'next/navigation';
import FirstVisitAnimation from '@/components/utils/animations/FirstVisitAnimation';
import SmoothScroll from '@/components/utils/SmoothScroll'
import ScrollToTop from '@/components/utils/ScrollToTop';

// Fun trick
import ConsoleMessage from './../ConsoleMessage';


export const metadata: Metadata = {
  title: "Welcome to GDG on Campus MUST",
  description: "This is a website for GDG on Campus at Mongolian University of Science and Technology",
}; 

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  } 
 
  // Providing all messages to the client
  // side is the easiest way to get started
  // const messages = await getMessages();
  const messages = await getMessages({ locale });

  
  return (
    <html lang={locale}>
      <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          {/* <CustomCursor /> */}
          <ScrollToTop />
          <FirstVisitAnimation />
          <div className="flex flex-col min-h-screen">
            <div className="w-full fixed z-30">  
              <MainNavbar />
            </div>
            
            {/* Add padding top to account for fixed navbar */}
            <div className="flex-grow"> {/* Adjust padding value to match navbar height */}
              <ConsoleMessage />
              {children}
            </div>
            
            <footer className="mt-auto">
              <Footer />
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
