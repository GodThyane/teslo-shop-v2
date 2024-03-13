import React from 'react';
import Title from '@/components/ui/title/Title';
import Link from 'next/link';
import ProductsInCartCheckout from '@/app/(shop)/checkout/(checkout)/ui/ProductsInCartCheckout';
import PlaceOrder from '@/app/(shop)/checkout/(checkout)/ui/PlaceOrder';

const CheckoutPage = () => {
   return (
      <div className="flex justify-center items-center mb-72 px-5 sm:px-10">
         <div className="flex flex-col w-[1000px]">
            <Title title={'Verificar orden'} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
               {/*Carrito*/}
               <div className="flex flex-col mt-5">
                  <span className="text-xl">Ajustar productos</span>
                  <Link href={'/cart'} className="underline mb-5">
                     Editar carrito
                  </Link>

                  {/*Items*/}
                  <ProductsInCartCheckout />
               </div>

               {/*Checkout*/}
               <PlaceOrder />
            </div>
         </div>
      </div>
   );
};

export default CheckoutPage;
