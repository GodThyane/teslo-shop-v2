'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart/cart-store';
import { currencyFormat } from '@/utils/currencyFormat';

const OrderSummary = () => {
   const [loaded, setLoaded] = useState(false);

   const { total, totalWithTax, tax, itemsInCart } = useCartStore((state) =>
      state.getSummaryInformation()
   );

   useEffect(() => {
      setLoaded(true);
   }, []);

   if (!loaded) return <div>Loading...</div>;

   return (
      <div className="grid grid-cols-2">
         <span>No. Productos</span>
         <span className="text-right">
            {itemsInCart === 1 ? '1 Artículo' : `${itemsInCart} Artículos`}
         </span>

         <span>Subtotal</span>
         <span className="text-right">{currencyFormat(total)}</span>

         <span>Impuestos (15%)</span>
         <span className="text-right">{currencyFormat(tax)}</span>

         <span className="mt-5 text-2xl">Total:</span>
         <span className="mt-5 text-2xl text-right">
            {currencyFormat(totalWithTax)}
         </span>
      </div>
   );
};

export default OrderSummary;
