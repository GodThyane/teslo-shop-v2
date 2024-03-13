export const revalidate = 604800; // 1 week

import { Metadata, ResolvingMetadata } from 'next';

import React from 'react';
import { notFound } from 'next/navigation';
import { titleFont } from '@/config/fonts';
import ProductSlideshow from '@/components/product/slideshow/ProductSlideshow';
import ProductMobileSlideshow from '@/components/product/slideshow/ProductMobileSlideshow';
import { getProductBySlug } from '@/actions/product/get-product-by-slug';
import StockLabel from '@/components/product/stock-label/StockLabel';
import AddToCart from '@/app/(shop)/product/[slug]/ui/AddToCart';
import { currencyFormat } from '@/utils/currencyFormat';

interface Props {
   params: {
      slug: string;
   };
}

export async function generateMetadata(
   { params }: Props,
   parent: ResolvingMetadata
): Promise<Metadata> {
   const { slug } = params;

   const product = await getProductBySlug(slug);

   return {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      openGraph: {
         title: product?.title ?? 'Producto no encontrado',
         description: product?.description ?? '',
         images: [`/products/${product?.images[1]}`],
      },
   };
}

const ProductPage = async ({ params }: Props) => {
   const { slug } = params;
   const product = await getProductBySlug(slug);

   if (!product) {
      notFound();
   }

   return (
      <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
         {/*Slideshow*/}
         <div className="col-span-1 md:col-span-2">
            {/*Mobile view*/}
            <ProductMobileSlideshow
               images={product.images}
               title={product.title}
               className="block md:hidden"
            />

            {/*Desktop view*/}
            <ProductSlideshow
               title={product.title}
               className="hidden md:block"
               images={product.images}
            />
         </div>

         {/*Product info*/}
         <div className="col-span-1 px-5">
            <StockLabel slug={slug} />
            <h1
               className={`${titleFont.className} antialiased font-bold text-xl`}
            >
               {product.title}
            </h1>
            <p className="text-lg mb-5">{currencyFormat(product.price)}</p>

            <AddToCart product={product}></AddToCart>

            {/*Descripción*/}
            <h3 className="font-bold text-sm">Descripción</h3>
            <p className="font-light">{product.description}</p>
         </div>
      </div>
   );
};

export default ProductPage;
