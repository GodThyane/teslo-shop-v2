'use client';

import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
   CreateOrderActions,
   CreateOrderData,
   OnApproveActions,
   OnApproveData,
} from '@paypal/paypal-js';
import { setTransactionId } from '@/actions/payments/set-transaction-id';
import { paypalCheckPayment } from '@/actions/paypal/check-payment';

interface Props {
   orderId: string;
   amount: number;
}

const PayPalButton = ({ orderId, amount }: Props) => {
   const [{ isPending }] = usePayPalScriptReducer();

   const roundedAmount = amount.toFixed(2);
   if (isPending) {
      return (
         <div className="animate-pulse">
            <div className="h-[45px] bg-gray-300 rounded mb-[14px]"></div>
            <div className="h-[45px] bg-gray-300 rounded mb-[52px]"></div>
         </div>
      );
   }

   const createOrder = async (
      data: CreateOrderData,
      actions: CreateOrderActions
   ): Promise<string> => {
      const transactionId = await actions.order.create({
         purchase_units: [
            {
               invoice_id: orderId,
               // @ts-ignore
               amount: {
                  value: roundedAmount.toString(),
               },
            },
         ],
      });

      const { ok, message } = await setTransactionId(transactionId, orderId);

      if (!ok) {
         throw new Error(message);
      }

      return transactionId;
   };

   const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
      const details = await actions.order?.capture();
      if (!details) return;

      const id = details.id;

      if (!id) return;
      await paypalCheckPayment(id);
   };

   return (
      <div className="relative z-0">
         <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
      </div>
   );
};

export default PayPalButton;
