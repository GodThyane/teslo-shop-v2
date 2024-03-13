import React from 'react';
import { IoCartOutline } from 'react-icons/io5';
import Link from 'next/link';

const EmptyPage = () => {
   return (
      <div className="flex justify-center items-center h-[calc(100vh-116px)]">
         <IoCartOutline size={80} className="mx-5"></IoCartOutline>
         <div className={'flex flex-col items-center'}>
            <h1 className={'text-xl font-semibold'}>Tu carrito está vacío</h1>

            <Link href={'/'} className={'text-blue-500 mt-2 text-4xl'}>
               Regresar
            </Link>
         </div>
      </div>
   );
};

export default EmptyPage;
