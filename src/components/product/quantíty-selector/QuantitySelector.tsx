'use client';

import React from 'react';
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

interface Props {
   quantity: number;
   stock?: number;
   onQuantityChanged: (value: number) => void;
}

const QuantitySelector = ({ quantity, stock, onQuantityChanged }: Props) => {
   const onValueChanged = (value: number) => {
      if (quantity + value < 1) return;

      if (stock && quantity + value > stock) return;

      onQuantityChanged(quantity + value);
   };

   return (
      <div className="flex items-center">
         <button
            onClick={() => onValueChanged(-1)}
            disabled={quantity == 1}
            className={`${quantity == 1 && 'opacity-40'}`}
         >
            <IoRemoveCircleOutline size={30}></IoRemoveCircleOutline>
         </button>
         <span className="w-20 mx-3 px-5 py-1 bg-gray-200 text-center rounded">
            {quantity}
         </span>
         <button
            className={`${quantity == stock && 'opacity-40'}`}
            disabled={quantity == stock}
            onClick={() => onValueChanged(1)}
         >
            <IoAddCircleOutline size={30}></IoAddCircleOutline>
         </button>
      </div>
   );
};

export default QuantitySelector;
