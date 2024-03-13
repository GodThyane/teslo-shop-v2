import React from 'react';
import Link from 'next/link';
import { titleFont } from '@/config/fonts';

const Footer = () => {
   return (
      <div className="flex w-full justify-center text-xs mb-10 gap-4">
         <Link href={'/'}>
            <span className={`${titleFont.className} antialiased font-bold`}>
               Teslo{' '}
            </span>
            | Shop
            <span></span>
            <span> © {new Date().getFullYear()}</span>
         </Link>
         <Link href={'/'}>Privacidad & Legal</Link>
         <Link href={'/'}>Ubicaciones</Link>
      </div>
   );
};

export default Footer;
