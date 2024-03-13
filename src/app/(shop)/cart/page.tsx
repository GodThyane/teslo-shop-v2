import React from 'react';
import Title from '@/components/ui/title/Title';
import Link from 'next/link';
import ProductsInCart from '@/app/(shop)/cart/ui/ProductsInCart';
import OrderSummary from '@/app/(shop)/cart/ui/OrderSummary';

const CartPage = () => {
   /*redirect('/empty');*/

   return (
      <div className="flex justify-center items-center mb-72 px-5 sm:px-10">
         <div className="flex flex-col w-[1000px]">
            <Title title={'Carrito'} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
               {/*Carrito*/}
               <div className="flex flex-col mt-5">
                  <span className="text-xl">Agregar más productos</span>
                  <Link href={'/'} className="underline mb-5">
                     Continúa comprando
                  </Link>

                  {/*Items*/}
                  <ProductsInCart />
               </div>

               {/*Checkout*/}
               <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
                  <h2 className={'text-2xl mb-2 font-bold'}>
                     Resumen de órden
                  </h2>
                  <OrderSummary />

                  <div className="mt-5 mb-2">
                     <Link
                        href={'/checkout/address'}
                        className="flex btn-primary justify-center"
                     >
                        Checkout
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CartPage;
