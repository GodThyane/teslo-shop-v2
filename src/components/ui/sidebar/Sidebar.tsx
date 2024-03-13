'use client';

import React from 'react';
import {
   IoCloseOutline,
   IoLogInOutline,
   IoLogOutOutline,
   IoPeopleOutline,
   IoPersonOutline,
   IoSearchOutline,
   IoShirtOutline,
   IoTicketOutline,
} from 'react-icons/io5';
import Link from 'next/link';
import { useUIStore } from '@/store/ui/ui-store';
import clsx from 'clsx';
import { logout } from '@/actions/auth/logout';
import { useSession } from 'next-auth/react';

interface MenuItem {
   icon: React.ReactNode;
   title: string;
   link: string;
   roles?: string[];
}

const userMenuItems: MenuItem[] = [
   {
      icon: <IoPersonOutline size={30} />,
      title: 'Perfil',
      link: '/profile',
   },
   {
      icon: <IoTicketOutline size={30} />,
      title: 'Órdenes',
      link: '/orders',
   },
];

const adminMenuItems: MenuItem[] = [
   {
      icon: <IoShirtOutline size={30} />,
      title: 'Productos',
      link: '/admin/products',
   },
   {
      icon: <IoTicketOutline size={30} />,
      title: 'Órdenes',
      link: '/admin/orders',
   },
   {
      icon: <IoPeopleOutline size={30} />,
      title: 'Usuarios',
      link: '/admin/users',
   },
];

const Sidebar = () => {
   const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
   const closeSideMenu = useUIStore((state) => state.closeSideMenu);

   const { data: session, status } = useSession();

   const isAdmin = session?.user?.role === 'admin';
   const isAuthenticated = !!session?.user;

   return (
      <div>
         {/*Backgroud black*/}
         {isSideMenuOpen && (
            <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"></div>
         )}

         {/*Blur*/}
         {isSideMenuOpen && (
            <div
               onClick={() => closeSideMenu()}
               className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur"
            ></div>
         )}

         {/*Sidemenu*/}
         <nav
            className={clsx(
               'fixed p-5 right-0 top-0 w-full  sm:w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300',
               {
                  'translate-x-full': !isSideMenuOpen,
               }
            )}
         >
            <IoCloseOutline
               size={50}
               className="absolute top-5 right-5 cursor-pointer"
               onClick={() => closeSideMenu()}
            />

            {/*Input*/}
            <div className="relative mt-14">
               <IoSearchOutline size={20} className="absolute top-2 left-2" />
               <input
                  type="text"
                  placeholder="Buscar"
                  className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl focus:outline-none focus:border-blue-500"
               />
            </div>

            {/*Menu*/}
            {isAuthenticated &&
               userMenuItems.map(({ icon, link, title }) => (
                  <Link
                     onClick={() => closeSideMenu()}
                     key={link}
                     href={link}
                     className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                  >
                     {icon}
                     <span className="ml-3 text-xl">{title}</span>
                  </Link>
               ))}

            {/*Line Separator*/}
            {isAdmin && <div className="w-full h-px bg-gray-200 my-10"></div>}

            {isAdmin &&
               adminMenuItems.map(({ icon, link, title }) => (
                  <Link
                     onClick={() => closeSideMenu()}
                     key={link}
                     href={link}
                     className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                  >
                     {icon}
                     <span className="ml-3 text-xl">{title}</span>
                  </Link>
               ))}

            {/*Footer*/}
            <div className={'absolute bottom-5 w-full'}>
               {!isAuthenticated ? (
                  <Link
                     href={'/auth/login'}
                     onClick={() => closeSideMenu()}
                     className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                  >
                     <IoLogInOutline size={30}></IoLogInOutline>
                     <span className="ml-3 text-xl">Ingresar</span>
                  </Link>
               ) : (
                  <button
                     onClick={() => logout()}
                     className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                  >
                     <IoLogOutOutline size={30}></IoLogOutOutline>
                     <span className="ml-3 text-xl">Salir</span>
                  </button>
               )}
            </div>
         </nav>
      </div>
   );
};

export default Sidebar;
