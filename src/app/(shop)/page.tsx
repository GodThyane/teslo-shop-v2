export const revalidate = 60; // 1 minute

import Title from '@/components/ui/title/Title';
import ProductGrid from '@/components/products/product-grid/ProductGrid';
import { getPaginatedProductsWithImages } from '@/actions/product/product-pagination';
import { redirect } from 'next/navigation';
import Pagination from '@/components/ui/pagination/Pagination';

interface Props {
   searchParams: {
      page?: string;
   };
}

export default async function Home({ searchParams }: Props) {
   const page = searchParams.page ? parseInt(searchParams.page) : 1;
   const { products, totalPages } = await getPaginatedProductsWithImages({
      page,
   });

   if (products.length === 0) {
      redirect('/');
   }

   return (
      <>
         <Title title="Tienda" subTitle="Todos los productos" />
         <ProductGrid products={products} />
         <Pagination totalPages={totalPages} />
      </>
   );
}
