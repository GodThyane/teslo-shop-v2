import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from 'react';
import Link from 'next/link';
import Title from '@/components/ui/title/Title';
import clsx from 'clsx';
import { IoCardOutline } from 'react-icons/io5';
import { getOrdersByAdmin } from '@/actions/order/get-orders-by-admin';
import Pagination from '@/components/ui/pagination/Pagination';
import { getPaginatedProductsWithImages } from '@/actions/product/product-pagination';
import { currencyFormat } from '@/utils/currencyFormat';
import ProductImageComponent from '@/components/product/product-image/ProductImageComponent';

const getOrderNumberId = (id: string) => {
   return parseInt(id, 16);
};

interface Props {
   searchParams: {
      page?: string;
   };
}

const ProductsAdminPage = async ({ searchParams }: Props) => {
   const page = searchParams.page ? parseInt(searchParams.page) : 1;

   const { totalPages, products } = await getPaginatedProductsWithImages({
      page,
   });

   if (products.length === 0) {
      return (
         <div className="flex flex-col justify-center items-center h-[calc(100vh-113px)]">
            <p className="text-2xl font-light">No hay productos</p>
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
         <Title title="Productos" subTitle="Historial de productos" />

         <div className="flex justify-end mb-5">
            <Link href="/admin/product/new" className="btn-primary">
               Nuevo producto
            </Link>
         </div>

         <div className="mb-10">
            <table className="min-w-full">
               <thead className="bg-gray-200 border-b">
                  <tr>
                     <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                     >
                        Imagen
                     </th>
                     <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                     >
                        Título
                     </th>
                     <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                     >
                        Precio
                     </th>
                     <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                     >
                        Género
                     </th>
                     <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                     >
                        Stock
                     </th>
                     <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                     >
                        Tallas
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {products.map((product) => (
                     <tr
                        className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                        key={product.id}
                     >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                           <Link href={`/product/${product.slug}`}>
                              <ProductImageComponent
                                 src={product.ProductImage[0]?.url}
                                 alt={product.title}
                                 width={80}
                                 height={80}
                                 className="w-20 h-20 object-cover rounded"
                              />
                           </Link>
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                           <Link
                              href={`/admin/product/${product.slug}`}
                              className="hover:underline"
                           >
                              {product.title}
                           </Link>
                        </td>
                        <td className="text-sm font-bold px-6 py-4 whitespace-nowrap">
                           {currencyFormat(product.price)}
                        </td>
                        <td className="text-sm  px-6 py-4 whitespace-nowrap">
                           {product.gender}
                        </td>
                        <td className="text-sm px-6 py-4 whitespace-nowrap">
                           {product.inStock}
                        </td>
                        <td
                           className={
                              'text-sm font-bold px-6 py-4 whitespace-nowrap'
                           }
                        >
                           {product.sizes.join(', ')}
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

export default ProductsAdminPage;
