'use client';

import React, { useState } from 'react';
import { Product } from '@/interfaces/product.interface';
import Image from 'next/image';
import Link from 'next/link';
import { currencyFormat } from '@/utils/currencyFormat';
import ProductImageComponent from '@/components/product/product-image/ProductImageComponent';

interface Props {
   product: Product;
}

const ProductGridItem = ({ product }: Props) => {
   const [displayImage, setDisplayImage] = useState(product.images[0]);

   return (
      <div className="rounded-md overflow-hidden fade-in">
         <Link href={`/product/${product.slug}`}>
            <ProductImageComponent
               src={displayImage}
               alt={product.title}
               width={500}
               height={500}
               className="w-full object-cover"
               onMouseEnter={() => setDisplayImage(product.images[1])}
               onMouseLeave={() => setDisplayImage(product.images[0])}
            />
         </Link>
         <div className="p-4 flex flex-col">
            <Link
               href={`/product/${product.slug}`}
               className="hover:text-blue-600"
            >
               {product.title}
            </Link>
            <span className="font-bold">{currencyFormat(product.price)}</span>
         </div>
      </div>
   );
};

export default ProductGridItem;
