'use server';

import { Address } from '@/interfaces/address.interface';
import { auth } from '@/auth.config';
import { SizeProduct } from '@/interfaces/product.interface';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface ProductToOrder {
   productId: string;
   quantity: number;
   size: SizeProduct;
}

export const placeOrder = async (
   products: ProductToOrder[],
   address: Address
) => {
   try {
      const session = await auth();
      const userId = session?.user?.id;

      // Check if user is authenticated
      if (!userId) {
         return {
            ok: false,
            message: 'Usuario no autenticado',
         };
      }

      //Obtener la información de los productos
      // Nota: recordad que se puedan lleva 1+ productos con el mismo Id
      const productsDb = await prisma.product.findMany({
         where: {
            id: {
               in: products.map((p) => p.productId),
            },
         },
      });

      // Calcular los montos // Encabezado
      const itemsInOrder = products.reduce(
         (acc, product) => acc + product.quantity,
         0
      );

      // Los totales de tax, total, y totalConTax
      const { total, tax, totalWithTax } = products.reduce(
         (totals, item) => {
            const productQuantity = item.quantity;
            const product = productsDb.find((p) => p.id === item.productId);

            if (!product) throw new Error('Producto no encontrado');

            const totalProduct = product.price * productQuantity;

            totals.total += totalProduct;
            totals.tax += totalProduct * 0.15;
            totals.totalWithTax += totalProduct * 1.15;

            return totals;
         },
         { total: 0, tax: 0, totalWithTax: 0 }
      );

      // Crear la transacción de la base de datos

      try {
         const prismaTx = await prisma.$transaction(async (tx) => {
            // 1. Actualizar el stock de los productos
            const updatedProductsPromises = productsDb.map((product) => {
               // Acumular los valores
               const productQuantity = products
                  .filter((p) => p.productId === product.id)
                  .reduce((acc, p) => acc + p.quantity, 0);

               if (productQuantity === 0) {
                  throw new Error('Cantidad de producto en 0');
               }

               return tx.product.update({
                  where: {
                     id: product.id,
                  },
                  data: {
                     inStock: {
                        decrement: productQuantity,
                     },
                  },
               });
            });

            const updatedProducts = await Promise.all(updatedProductsPromises);

            // Validar si hay valores negativos
            updatedProducts.forEach((product) => {
               if (product.inStock < 0) {
                  throw new Error(`${product.title} sin stock`);
               }
            });

            // 2. Crear la orden [Header - Detalles]
            const order = await tx.order.create({
               data: {
                  userId,
                  tax,
                  total,
                  totalWithTax,
                  itemsInOrder,

                  OrderItems: {
                     createMany: {
                        data: products.map((product) => ({
                           quantity: product.quantity,
                           productId: product.productId,
                           size: product.size,
                           price:
                              productsDb.find((p) => p.id === product.productId)
                                 ?.price ?? 0,
                        })),
                     },
                  },
               },
               select: {
                  OrderItems: {
                     select: {
                        price: true,
                     },
                  },
                  id: true,
               },
            });

            // Validar si hay algún precio en 0.
            const priceZero = order.OrderItems.find((item) => item.price === 0);
            if (priceZero) {
               throw new Error('Precio de producto en 0');
            }

            const { country: countryId, ...rest } = address;

            // 3. Crear la dirección de la orden
            const orderAddress = await tx.orderAddress.create({
               data: {
                  ...rest,
                  orderId: order.id,
                  countryId,
               },
            });

            return {
               order: order,
               updatedProducts: updatedProducts,
               orderAddress: orderAddress,
            };
         });

         // Revalidate paths
         revalidatePath('/orders');
         revalidatePath('/admin/orders');
         revalidatePath(`/orders/${prismaTx.order.id}`);
         return {
            ok: true,
            order: prismaTx.order.id,
            prismaTx,
         };
      } catch (e: any) {
         return {
            ok: false,
            message: e?.message,
         };
      }
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Error al procesar la orden',
      };
   }
};
