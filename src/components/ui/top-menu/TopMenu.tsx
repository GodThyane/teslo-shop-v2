'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { titleFont } from '@/config/fonts';
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';
import { useUIStore } from '@/store/ui/ui-store';
import { useCartStore } from '@/store/cart/cart-store';
import clsx from 'clsx';

interface CategoryLinks {
   name: string;
   href: string;
}

const categories: CategoryLinks[] = [
   { name: 'Hombres', href: '/gender/men' },
   { name: 'Mujeres', href: '/gender/women' },
   { name: 'Niños', href: '/gender/kid' },
];

const getTotalItemsFormatted = (totalItems: number, limit: number = 9) => {
   if (totalItems === 0) return '';
   if (totalItems > limit) return `${limit}+`;
   return totalItems.toString();
};

const TopMenu = () => {
   const openSideMenu = useUIStore((state) => state.openSideMenu);
   const totalItems = useCartStore((state) => state.getCartTotal());
   const totalItemsFormatted = getTotalItemsFormatted(totalItems, 99);

   const [loaded, setLoaded] = useState(false);

   useEffect(() => {
      setLoaded(true);
   }, []);

   return (
      <nav className="flex px-5 justify-between items-center w-full">
         {/*Logo*/}
         <div>
            <Link href="/">
               <span className={`${titleFont.className} antialiased font-bold`}>
                  Teslo
               </span>
               <span> | Shop</span>
            </Link>
         </div>
         {/*Center menu*/}
         <div className="hidden sm:block">
            {categories.map((category) => (
               <Link
                  key={category.href}
                  href={category.href}
                  className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
               >
                  {category.name}
               </Link>
            ))}
         </div>

         {/*Search, Cart, Menu*/}
         <div className="flex items-center gap-4">
            <Link href="/search">
               <IoSearchOutline size={20}></IoSearchOutline>
            </Link>
            <Link href="/cart">
               <div className="relative">
                  <span
                     className={clsx(
                        'fade-in absolute text-xs rounded-full px-1 font-bold -top-2 bg-blue-700 text-white -right-2',
                        {
                           '-right-2':
                              loaded && totalItemsFormatted.length === 1,
                           '-right-3': loaded && totalItemsFormatted.length > 1,
                        }
                     )}
                  >
                     {loaded && totalItemsFormatted}
                  </span>
                  <IoCartOutline size={20}></IoCartOutline>
               </div>
            </Link>
            <button
               onClick={() => openSideMenu()}
               className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
            >
               Menú
            </button>
         </div>
      </nav>
   );
};

export default TopMenu;
