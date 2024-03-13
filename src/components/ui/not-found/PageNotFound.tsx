import React from 'react';
import { titleFont } from '@/config/fonts';
import Link from 'next/link';
import Image from 'next/image';

const PageNotFound = () => {
   return (
      <div className="flex flex-col-reverse md:flex-row  h-[calc(100vh-112px)] w-full justify-center items-center align-middle">
         <div className="text-center px-5 mx-5">
            <h2 className={`${titleFont.className} antialiased text-9xl`}>
               404
            </h2>
            <p className="font-semibold text-xl">
               Ups! No encontramos la página
            </p>
            <p className="font-light">
               <span>Puedes regresar al </span>
               <Link
                  href={'/'}
                  className="font-normal hover:underline transition-all"
               >
                  inicio
               </Link>
            </p>
         </div>
         <div className="px-5 mx-5">
            <Image
               src={'/imgs/starman_750x750.png'}
               alt={'Starman'}
               className="p-5 sm:p-0"
               width={550}
               height={550}
            ></Image>
         </div>
      </div>
   );
};

export default PageNotFound;
