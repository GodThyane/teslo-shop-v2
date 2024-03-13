'use server';

import { auth } from '@/auth.config';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const setTransactionId = async (
   transactionId: string,
   orderId: string
) => {
   try {
      const session = await auth();
      const userId = session?.user?.id!;

      const order = await prisma.order.findUnique({
         where: {
            id: orderId,
         },
      });

      if (!order) {
         return {
            ok: false,
            error: 404,
            message: 'Order not found',
         };
      }

      if (order.userId !== userId) {
         return {
            ok: false,
            error: 403,
            message: "User's not authorized",
         };
      }

      await prisma.order.update({
         where: {
            id: orderId,
         },
         data: {
            transactionId,
         },
      });

      // Revalidate paths
      revalidatePath('/orders');
      revalidatePath('/admin/orders');
      revalidatePath(`/orders/${orderId}`);

      return {
         ok: true,
      };
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         error: 500,
         message: 'Internal server error',
      };
   }
};
