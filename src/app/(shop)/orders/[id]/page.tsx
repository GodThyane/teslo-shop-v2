import React from 'react';
import Title from '@/components/ui/title/Title';
import Image from 'next/image';
import { getOrderById } from '@/actions/order/get-order-by-id';
import { notFound, redirect } from 'next/navigation';
import { currencyFormat } from '@/utils/currencyFormat';
import PayPalButton from '@/components/paypal/PayPalButton';
import OrderStatus from '@/components/orders/OrderStatus';
import ProductImageComponent from '@/components/product/product-image/ProductImageComponent';

interface Props {
   params: {
      id: string;
   };
}

const fullAddress = (address: string, address2?: string) => {
   return `${address} ${address2 ? ', ' + address2 : ''}`;
};

const OrderPage = async ({ params }: Props) => {
   const { id } = params;

   const { data, error } = await getOrderById(id);

   switch (error) {
      case 404:
         notFound();
         break;
      case 403:
         redirect('/orders/unauthorized');
         break;
      case 500:
         return <div>Error en el servidor...</div>;
   }

   // Convert uuid to number

   const orderNumber = parseInt(id, 16);

   const order = data?.order;

   const {
      OrderItems: orderItems,
      isPaid,
      OrderAddress: address,
      total,
      tax,
      totalWithTax,
      itemsInOrder,
   } = order!;

   return (
      <div className="flex justify-center items-center mb-72 px-5 sm:px-10">
         <div className="flex flex-col w-[1000px]">
            <Title title={`Orden #${orderNumber}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
               {/*Carrito*/}
               <div className="flex flex-col mt-5">
                  <OrderStatus isPaid={isPaid} />

                  {/*Items*/}
                  {orderItems.map(({ product, size, price, quantity }) => (
                     <div
                        key={`${product.slug}-${size}`}
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
                           <p>
                              {size} {product.title}
                           </p>
                           <p>
                              ${price} x {quantity}
                           </p>
                           <p className={'font-bold'}>
                              Subtotal ${price * quantity}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>

               {/*Checkout*/}
               <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
                  <h2 className={'text-2xl mb-2 font-bold'}>
                     Dirección de entrega
                  </h2>
                  <div className="mb-10">
                     <p className={'text-xl'}>
                        {address?.firstName} {address?.lastName}
                     </p>
                     <p>{fullAddress(address?.address!, address?.address2!)}</p>
                     <p>
                        {address?.city}, {address?.countryId}
                     </p>
                     <p>CP {address?.postalCode}</p>
                     <p>{address?.phone}</p>
                  </div>

                  {/*Divider*/}
                  <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

                  <h2 className={'text-2xl mb-2 font-bold'}>
                     Resumen de órden
                  </h2>
                  <div className="grid grid-cols-2">
                     <span>No. Productos</span>
                     <span className="text-right">
                        {itemsInOrder === 1
                           ? '1 Artículo'
                           : `${itemsInOrder} Artículos`}
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
                     {!isPaid ? (
                        <PayPalButton
                           amount={totalWithTax}
                           orderId={order?.id!}
                        />
                     ) : (
                        <OrderStatus isPaid={true} />
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default OrderPage;
