'use client';

import React, { useState } from 'react';
import SizeSelector from '@/components/product/size-selector/SizeSelector';
import QuantitySelector from '@/components/product/quantíty-selector/QuantitySelector';
import {
   CartProduct,
   Product,
   SizeProduct,
} from '@/interfaces/product.interface';
import { useCartStore } from '@/store/cart/cart-store';

interface Props {
   product: Product;
}

const AddToCart = ({ product }: Props) => {
   const addProductToCart = useCartStore((state) => state.addToCart);

   const [size, setSize] = useState<SizeProduct | undefined>();
   const [quantity, setQuantity] = useState(1);
   const [posted, setPosted] = useState(false);

   const addToCart = () => {
      setPosted(true);
      if (!size) return;

      const { slug, title, price, images, id } = product;

      const cartProduct: CartProduct = {
         id,
         size,
         quantity,
         slug,
         price,
         title,
         image: images[0],
      };

      addProductToCart(cartProduct);

      // Reset
      setSize(undefined);
      setQuantity(1);
      setPosted(false);
   };

   return (
      <>
         {posted && !size && (
            <span className="mt-2 text-red-500">
               Debe de seleccionar una talla*
            </span>
         )}
         {/*Selecto de tallas*/}
         <SizeSelector
            selectedSize={size}
            availableSizes={product.sizes}
            onSizeChanged={setSize}
         />

         {/*Selector de cantidad*/}
         <QuantitySelector
            quantity={quantity}
            stock={product.inStock}
            onQuantityChanged={setQuantity}
         />

         {/*Botón de compra*/}
         <button onClick={addToCart} className="btn-primary my-5">
            Agregar al carrito
         </button>
      </>
   );
};

export default AddToCart;
