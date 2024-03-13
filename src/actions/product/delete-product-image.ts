'use server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
   if (!imageUrl.startsWith('http')) {
      return {
         ok: false,
         error: 'Invalid image url, dont remove the default image',
      };
   }

   const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';

   try {
      await cloudinary.uploader.destroy(imageName);
      const productSlug = await prisma.productImage.delete({
         where: {
            id: imageId,
         },
         select: {
            product: {
               select: {
                  slug: true,
               },
            },
         },
      });
      // Revalidar paths
      revalidatePath('/admin/products');
      revalidatePath(`/admin/product/${productSlug}`);
      revalidatePath(`/products/${productSlug}`);
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         error: 'Error deleting image from cloudinary or database',
      };
   }
};
