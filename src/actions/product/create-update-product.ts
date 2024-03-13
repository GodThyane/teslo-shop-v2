'use server';

import { z } from 'zod';
import { Gender, Product, Size } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
   cloud_name: 'dqmlrpmez',
   api_key: '713661836273515',
   api_secret: '69WqDaKY6zRKyXKZEE-JPK7N7Pk',
});

const productSchema = z.object({
   id: z.string().uuid().optional().nullable(),
   title: z.string().min(3).max(225),
   slug: z.string().min(3).max(225),
   description: z.string(),
   price: z.coerce
      .number()
      .min(0)
      .transform((val) => Number(val.toFixed(2))),
   inStock: z.coerce
      .number()
      .min(0)
      .transform((val) => Number(val.toFixed(2))),
   categoryId: z.string().uuid(),
   sizes: z.coerce.string().transform((val) => val.split(',')),
   tags: z.string(),
   gender: z.nativeEnum(Gender),
});
export const createUpdateProduct = async (formData: FormData) => {
   const data = Object.fromEntries(formData.entries());
   const productParsed = productSchema.safeParse(data);

   if (!productParsed.success) {
      console.log(productParsed.error);
      return {
         ok: false,
         error: productParsed.error,
      };
   }
   const { data: product } = productParsed;
   product.slug = product.slug.toLowerCase().trim().replace(/ /g, '-');

   const { id, sizes, tags, ...rest } = product;
   const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase());

   try {
      const prismaTx = await prisma.$transaction(async (tx) => {
         let product: Product;
         if (id) {
            // Update
            product = await prisma.product.update({
               where: {
                  id,
               },
               data: {
                  ...rest,
                  sizes: {
                     set: sizes as Size[],
                  },
                  tags: {
                     set: tagsArray,
                  },
               },
            });
         } else {
            // Create
            product = await prisma.product.create({
               data: {
                  ...rest,
                  sizes: {
                     set: sizes as Size[],
                  },
                  tags: {
                     set: tagsArray,
                  },
               },
            });
         }

         // Proceos de carga y guardado de imágenes
         // Recorrer las imágenes y guardarlas
         if (formData.getAll('images')) {
            const images = await uploadImages(
               formData.getAll('images') as File[]
            );

            if (!images) {
               throw new Error('Error uploading images, rollingback');
            }

            await prisma.productImage.createMany({
               data: images.map((image) => ({
                  url: image!,
                  productId: product.id,
               })),
            });
         }

         return {
            product,
         };
      });

      revalidatePath('/admin/products');
      revalidatePath(`/admin/product/${product.slug}`);
      revalidatePath(`/products/${product.slug}`);

      return {
         ok: true,
         product: prismaTx.product,
      };
   } catch (e) {
      console.log('Error', e);
      return {
         ok: false,
         message: 'Error al guardar el producto',
      };
   }
};

const uploadImages = async (images: File[]) => {
   try {
      const uploadPromises = images.map(async (image) => {
         try {
            const buffer = await image.arrayBuffer();
            const base64Image = Buffer.from(buffer).toString('base64');

            return cloudinary.uploader
               .upload(`data:image/png;base64,${base64Image}`)
               .then((r) => r.secure_url);
         } catch (e) {
            console.log('Error uploading image', e);
            return null;
         }
      });

      return await Promise.all(uploadPromises);
   } catch (e) {
      console.log('Error uploading images', e);
      return null;
   }
};
