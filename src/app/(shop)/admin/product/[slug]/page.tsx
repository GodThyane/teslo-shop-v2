import React from 'react';
import Title from '@/components/ui/title/Title';
import { getProductBySlug } from '@/actions/product/get-product-by-slug';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/app/(shop)/admin/product/[slug]/ui/ProductForm';
import { getAllCategories } from '@/actions/categories/get-all-categories';

interface Props {
   params: {
      slug: string;
   };
}

const ProductAdminPage = async ({ params }: Props) => {
   const { slug } = params;

   const product = await getProductBySlug(slug);
   if (!product && slug !== 'new') {
      notFound();
   }

   const title = slug === 'new' ? 'Nuevo producto' : 'Editar producto';

   const categories = await getAllCategories();

   return (
      <div>
         <Title title={title} />

         <ProductForm product={product ?? {}} categories={categories} />
      </div>
   );
};

export default ProductAdminPage;
