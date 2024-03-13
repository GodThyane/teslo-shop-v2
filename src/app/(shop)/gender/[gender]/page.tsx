export const revalidate = 60; // 1 minute

import React from 'react';
import { redirect } from 'next/navigation';
import Title from '@/components/ui/title/Title';
import ProductGrid from '@/components/products/product-grid/ProductGrid';
import { getPaginatedProductsWithImages } from '@/actions/product/product-pagination';
import Pagination from '@/components/ui/pagination/Pagination';
import { Gender } from '@prisma/client';

interface Props {
   params: {
      gender: Gender;
   };
   searchParams: {
      page?: string;
   };
}

const labels: Record<Gender, string> = {
   men: 'Hombres',
   women: 'Mujeres',
   kid: 'Niños',
   unisex: 'Todos',
};

const GenderPage = async ({ params, searchParams }: Props) => {
   const { gender } = params;
   const page = searchParams.page ? parseInt(searchParams.page) : 1;

   const { products, totalPages } = await getPaginatedProductsWithImages({
      page,
      gender,
   });

   if (products.length === 0) {
      redirect('/');
   }

   const title = labels[gender];

   return (
      <>
         <Title
            title={title}
            subTitle={`Artículos para ${title.toLowerCase()}`}
            className="mb-2"
         />
         <ProductGrid products={products} />
         <Pagination totalPages={totalPages} />
      </>
   );
};

export default GenderPage;
