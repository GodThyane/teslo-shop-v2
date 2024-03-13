export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from 'react';
import Link from 'next/link';
import Title from '@/components/ui/title/Title';
import clsx from 'clsx';
import { IoCardOutline } from 'react-icons/io5';
import { getOrdersByAdmin } from '@/actions/order/get-orders-by-admin';
import Pagination from '@/components/ui/pagination/Pagination';

const getOrderNumberId = (id: string) => {
   return parseInt(id, 16);
};

interface Props {
   searchParams: {
      page?: string;
   };
}

const OrdersAdminPage = async ({ searchParams }: Props) => {
   const page = searchParams.page ? parseInt(searchParams.page) : 1;

   const { totalPages, orders } = await getOrdersByAdmin({ page });

   if (orders.length === 0) {
      return (
         <div className="flex flex-col justify-center items-center h-[calc(100vh-113px)]">
            <p className="text-2xl font-light">No hay órdenes</p>
            {/*Link a home para comprar*/}
            <Link
               href={'/'}
               className="font-normal hover:underline transition-all text-blue-600"
            >
               Regresar al inicio
            </Link>
         </div>
      );
   }

   return (
      <>
         <Title title="Órdenes" subTitle="Historial de órdenes" />

         <div className="mb-10">
            <table className="min-w-full">
               <thead className="bg-gray-200 border-b">
                  <tr>
                     <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                     >
                        #ID
                     </th>
                     <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                     >
                        Nombre completo
                     </th>
                     <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                     >
                        Estado
                     </th>
                     <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                     >
                        Opciones
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {orders.map((order) => (
                     <tr
                        className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                        key={order.id}
                     >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                           {getOrderNumberId(order.id)}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                           {order.OrderAddress?.firstName}{' '}
                           {order.OrderAddress?.lastName}
                        </td>
                        <td
                           className={clsx(
                              'flex items-center text-sm font-light px-6 py-4 whitespace-nowrap',
                              {
                                 'text-green-800': order.isPaid,
                                 'text-red-800': !order.isPaid,
                              }
                           )}
                        >
                           <IoCardOutline />
                           <span className="mx-2">
                              {order.isPaid ? 'Pagado' : 'Pendiente'}
                           </span>
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 ">
                           <Link
                              href={`/orders/${order.id}`}
                              className="hover:underline"
                           >
                              Ver orden
                           </Link>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <Pagination totalPages={totalPages} />
      </>
   );
};

export default OrdersAdminPage;
