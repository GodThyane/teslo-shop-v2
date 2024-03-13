'use server';

import { PayPalOrderStatusResponse } from '@/interfaces/paypal.interface';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const paypalCheckPayment = async (transactionId: string) => {
   const { ok, token } = await getBearerToken();
   if (!ok) {
      return {
         ok: false,
         message: 'Error getting token',
      };
   }

   const response = await verifyPayPalPayment(transactionId, token);
   if (!response) {
      return {
         ok: false,
         message: 'Error verifying payment',
      };
   }

   const { purchase_units, status } = response;

   const { invoice_id: orderId } = purchase_units[0]; // Uncomment this line to see the structure of purchase_units

   if (status !== 'COMPLETED') {
      return {
         ok: false,
         message: 'Payment not completed',
      };
   }

   // Realizar la actualización de la base de datos;
   const { ok: updated } = await updateOrderStatus(orderId);

   if (!updated) {
      return {
         ok: false,
         message: 'Error updating order status',
      };
   }

   // Revalidar path
   revalidatePath(`/orders/${orderId}`);
};

const getBearerToken = async () => {
   const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
   const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
   const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL ?? '';

   const base64Token = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
   ).toString('base64');

   try {
      const response = await fetch(PAYPAL_OAUTH_URL, {
         method: 'POST',
         headers: {
            Authorization: `Basic ${base64Token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
         },
         body: 'grant_type=client_credentials',
         cache: 'no-store',
      });

      const data = await response.json();

      return {
         ok: true,
         token: data.access_token,
      };
   } catch (e) {
      console.log(e);
      return { ok: false };
   }
};

const verifyPayPalPayment = async (
   transactionId: string,
   bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
   const PAYPAL_ORDERS_URL = process.env.PAYPAL_ORDERS_URL ?? '';

   try {
      const response = await fetch(`${PAYPAL_ORDERS_URL}/${transactionId}`, {
         method: 'GET',
         headers: {
            Authorization: `Bearer ${bearerToken}`,
         },
         cache: 'no-store',
      });

      return await response.json();
   } catch (e) {
      return null;
   }
};

const updateOrderStatus = async (orderId: string) => {
   try {
      const orderUpdated = await prisma.order.update({
         where: {
            id: orderId,
         },
         data: {
            paidAt: new Date(),
            isPaid: true,
         },
      });

      if (!orderUpdated) {
         return {
            ok: false,
            message: 'Error updating order',
         };
      }

      return {
         ok: true,
      };
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Internal server error',
      };
   }
};
