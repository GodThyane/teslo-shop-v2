'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth.config';
import { Session } from 'next-auth';

export const getOrderById = async (id: string) => {
   const session = (await auth()) as Session;
   const userId = session.user.id;

   const order = await prisma.order.findUnique({
      where: {
         id,
      },
      include: {
         OrderAddress: true,
         OrderItems: {
            select: {
               price: true,
               quantity: true,
               size: true,
               product: {
                  select: {
                     title: true,
                     slug: true,

                     ProductImage: {
                        select: {
                           url: true,
                        },
                        take: 1,
                     },
                  },
               },
            },
         },
      },
   });

   if (!order)
      return {
         ok: false,
         error: 404,
      };

   if (order.userId !== userId) {
      return {
         ok: false,
         error: 403,
      };
   }

   try {
      return {
         ok: true,
         data: {
            order: {
               ...order,
               OrderItems: order.OrderItems.map((item) => ({
                  ...item,
                  product: {
                     ...item.product,
                     image: item.product.ProductImage[0].url,
                  },
               })),
            },
         },
      };
   } catch (e) {
      return {
         ok: false,
         error: 500,
      };
   }
};
