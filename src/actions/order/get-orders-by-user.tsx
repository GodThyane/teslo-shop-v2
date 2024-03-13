'use server';

import { auth } from '@/auth.config';
import { Session } from 'next-auth';
import { prisma } from '@/lib/prisma';

export const getOrdersByUser = async () => {
   const session = (await auth()) as Session;
   const userId = session.user.id;

   return prisma.order.findMany({
      where: {
         userId,
      },
      select: {
         id: true,
         OrderAddress: {
            select: {
               firstName: true,
               lastName: true,
            },
         },
         isPaid: true,
         paidAt: true,
      },
   });
};
