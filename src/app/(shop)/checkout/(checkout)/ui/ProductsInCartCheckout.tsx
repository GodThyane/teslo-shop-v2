'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import QuantitySelector from '@/components/product/quantíty-selector/QuantitySelector';
import { useCartStore } from '@/store/cart/cart-store';
import Link from 'next/link';
import { currencyFormat } from '@/utils/currencyFormat';
import ProductImageComponent from '@/components/product/product-image/ProductImageComponent';

const ProductsInCartCheckout = () => {
   useCartStore((state) => state.updateProductInCart);
   useCartStore((state) => state.removeFromCart);
   const [loaded, setLoaded] = useState(false);
   const productsInCart = useCartStore((state) => state.cart);

   useEffect(() => {
      setLoaded(true);
   }, []);

   if (!loaded) {
      return <p>Loading...</p>;
   }

   return (
      <>
         {productsInCart.map((product) => (
            <div
               key={`${product.slug}-${product.size}`}
               className={'flex mb-5'}
            >
               <ProductImageComponent
                  src={product.image}
                  alt={product.title}
                  width={100}
                  height={100}
                  className="mr-2 rounded w-[100px] h-[100px]"
               />
               <div>
                  <span>
                     <p>
                        {product.size} - {product.title} ({product.quantity})
                     </p>
                  </span>
                  <p className="font-bold">
                     {currencyFormat(product.price * product.quantity)}
                  </p>
               </div>
            </div>
         ))}
      </>
   );
};

export default ProductsInCartCheckout;
