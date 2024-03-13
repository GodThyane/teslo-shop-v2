'use client';

import React, { useEffect, useState } from 'react';
import { titleFont } from '@/config/fonts';
import { getStockBySlug } from '@/actions/product/get-stock-by-slug';

interface Props {
   slug: string;
}

const StockLabel = ({ slug }: Props) => {
   const [stock, setStock] = useState(0);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const getStock = async () => {
         const inStock = await getStockBySlug(slug);
         setStock(inStock);
         setIsLoading(false);
      };

      getStock();
   }, [slug]);

   return (
      <>
         {isLoading ? (
            <h1
               className={`${titleFont.className} antialiased font-bold text-lg animate-pulse bg-gray-200`}
            >
               &nbsp;
            </h1>
         ) : (
            <h1
               className={`${titleFont.className} antialiased font-bold text-lg`}
            >
               Stock: {stock}
            </h1>
         )}
      </>
   );
};

export default StockLabel;
