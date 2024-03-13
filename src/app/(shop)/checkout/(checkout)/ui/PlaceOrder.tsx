'use client';

import React, { useEffect, useState } from 'react';
import { useAddressStore } from '@/store/address/addrees-store';
import { useCartStore } from '@/store/cart/cart-store';
import { currencyFormat } from '@/utils/currencyFormat';
import clsx from 'clsx';
import { placeOrder } from '@/actions/order/place-order';
import { useRouter } from 'next/navigation';

const fullAddress = (address: string, address2?: string) => {
   return `${address} ${address2 ? ', ' + address2 : ''}`;
};

const PlaceOrder = () => {
   const router = useRouter();
   const [loaded, setLoaded] = useState(false);
   const addressStore = useAddressStore((state) => state.address);
   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
   const clearCart = useCartStore((state) => state.clearCart);

   const { tax, totalWithTax, total, itemsInCart } = useCartStore((state) =>
      state.getSummaryInformation()
   );

   const cart = useCartStore((state) => state.cart);

   const {
      address2,
      address,
      firstName,
      lastName,
      country,
      phone,
      postalCode,
      city,
   } = addressStore;

   const onPlaceOrder = async () => {
      setIsPlacingOrder(true);
      setErrorMessage('');

      const productsToOrder = cart.map((product) => ({
         productId: product.id,
         quantity: product.quantity,
         size: product.size,
      }));

      const res = await placeOrder(productsToOrder, addressStore);
      if (!res.ok) {
         setIsPlacingOrder(false);
         setErrorMessage(res.message);
         return;
      }

      //Salió bien
      clearCart();
      router.push(`/orders/${res.order}`);
   };

   useEffect(() => {
      setLoaded(true);
   }, []);

   if (!loaded) {
      return <p>Loading...</p>;
   }

   return (
      <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
         <h2 className={'text-2xl mb-2 font-bold'}>Dirección de entrega</h2>
         <div className="mb-10">
            <p className={'text-xl'}>
               {firstName} {lastName}
            </p>
            <p>{fullAddress(address, address2)}</p>
            <p>
               {city}, {country}
            </p>
            <p>CP {postalCode}</p>
            <p>{phone}</p>
         </div>

         {/*Divider*/}
         <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

         <h2 className={'text-2xl mb-2 font-bold'}>Resumen de órden</h2>
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

         <div className="mt-5 mb-2">
            <p className="mb-5">
               <span className="text-xs">
                  Al hacer clic en "Colocar orden", aceptas nuestros{' '}
                  <a href="#" className="underline">
                     términos y condiciones de uso
                  </a>{' '}
                  y{' '}
                  <a href="#" className="underline">
                     política de privacidad
                  </a>
               </span>
            </p>

            <div className="mb-2">
               <span className="text-red-500">{errorMessage}</span>
            </div>

            <button
               //href={'/orders/1'}
               onClick={() => onPlaceOrder()}
               disabled={isPlacingOrder}
               className={clsx('flex justify-center w-full', {
                  'btn-primary': !isPlacingOrder,
                  'btn-disabled': isPlacingOrder,
               })}
            >
               Colocar orden
            </button>
         </div>
      </div>
   );
};

export default PlaceOrder;
