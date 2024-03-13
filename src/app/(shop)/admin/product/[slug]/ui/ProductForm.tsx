'use client';

import { Product } from '@/interfaces/product.interface';
import { Category } from '@/interfaces/category.interface';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { createUpdateProduct } from '@/actions/product/create-update-product';
import React, { useEffect } from 'react';
import ProductImageComponent from '@/components/product/product-image/ProductImageComponent';
import { ProductImage } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { deleteProductImage } from '@/actions/product/delete-product-image';

interface Props {
   product: Partial<Product> & { ProductImage?: ProductImage[] };
   categories: Category[];
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface FormInputs {
   title: string;
   slug: string;
   description: string;
   price: number;
   inStock: number;
   sizes: string[];
   tags: string;
   gender: 'men' | 'women' | 'kid' | 'unisex';
   categoryId: string;

   //TODO: photos: 'string[]'
   images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
   const router = useRouter();

   const {
      handleSubmit,
      register,
      formState: { isValid },
      getValues,
      setValue,
      watch,
   } = useForm<FormInputs>({
      defaultValues: {
         ...product,
         tags: product.tags?.join(', '),
         sizes: product.sizes ?? [],

         images: undefined,
      },
   });

   useEffect(() => {
      const subs = watch((value, { name }) => {
         if (name === 'title') {
            const newSlug =
               value.title
                  ?.trim()
                  .replaceAll(/ /g, '_')
                  .replaceAll("'", '')
                  .toLowerCase() ?? '';
            setValue('slug', newSlug);
         }
      });

      return () => subs.unsubscribe();
   }, [setValue, watch]);

   watch('sizes');

   const onSubmit = async (data: FormInputs) => {
      const formData = new FormData();

      const { images, ...productToSave } = data;

      if (product.id) {
         formData.append('id', product.id ?? '');
      }
      formData.append('title', productToSave.title);
      formData.append('slug', productToSave.slug);
      formData.append('description', productToSave.description);
      formData.append('price', productToSave.price.toString());
      formData.append('inStock', productToSave.inStock.toString());
      formData.append('sizes', productToSave.sizes.toString());
      formData.append('tags', productToSave.tags);
      formData.append('categoryId', productToSave.categoryId);
      formData.append('gender', productToSave.gender);

      if (images) {
         for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
         }
      }

      const {
         ok,
         message,
         product: productDb,
      } = await createUpdateProduct(formData);

      if (!ok) {
         alert(message);
         return;
      }

      router.replace(`/admin/product/${productDb?.slug}`);
   };

   const onSizeChanged = (size: string) => {
      const sizes = new Set(getValues('sizes'));

      if (sizes.has(size)) {
         sizes.delete(size);
      } else {
         sizes.add(size);
      }

      setValue('sizes', Array.from(sizes));
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
      >
         {/* Textos */}
         <div className="w-full">
            <div className="flex flex-col mb-2">
               <span>Título</span>
               <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  {...register('title', { required: true })}
               />
            </div>

            <div className="flex flex-col mb-2">
               <span>Slug</span>
               <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  {...register('slug', { required: true })}
               />
            </div>

            <div className="flex flex-col mb-2">
               <span>Descripción</span>
               <textarea
                  rows={5}
                  className="p-2 border rounded-md bg-gray-200"
                  {...register('description', { required: true })}
               ></textarea>
            </div>

            <div className="flex flex-col mb-2">
               <span>Price</span>
               <input
                  type="number"
                  className="p-2 border rounded-md bg-gray-200"
                  {...register('price', { required: true, min: 0 })}
               />
            </div>

            <div className="flex flex-col mb-2">
               <span>Tags</span>
               <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-200"
                  {...register('tags', { required: true })}
               />
            </div>

            <div className="flex flex-col mb-2">
               <span>Gender</span>
               <select
                  className="p-2 border rounded-md bg-gray-200"
                  {...register('gender', { required: true })}
               >
                  <option value="">[Seleccione]</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kid">Kid</option>
                  <option value="unisex">Unisex</option>
               </select>
            </div>

            <div className="flex flex-col mb-2">
               <span>Categoria</span>
               <select
                  className="p-2 border rounded-md bg-gray-200"
                  {...register('categoryId', { required: true })}
               >
                  <option value="">[Seleccione]</option>
                  {categories.map((category) => (
                     <option key={category.id} value={category.id}>
                        {category.name}
                     </option>
                  ))}
               </select>
            </div>

            <button type={'submit'} className="btn-primary w-full">
               Guardar
            </button>
         </div>

         {/* Selector de tallas y fotos */}
         <div className="w-full">
            <div className="flex flex-col mb-2">
               <span>Inventario</span>
               <input
                  type="number"
                  className="p-2 border rounded-md bg-gray-200"
                  {...register('inStock', { required: true, min: 0 })}
               />
            </div>

            {/* As checkboxes */}
            <div className="flex flex-col">
               <span>Tallas</span>
               <div className="flex flex-wrap">
                  {sizes.map((size) => (
                     // bg-blue-500 text-white <--- si está seleccionado
                     <div
                        key={size}
                        onClick={() => onSizeChanged(size)}
                        className={clsx(
                           'p-2 border rounded-md mr-2 mb-2 w-14 transition-all text-center cursor-pointer',
                           {
                              'bg-blue-500 text-white':
                                 getValues('sizes').includes(size),
                           }
                        )}
                     >
                        <span>{size}</span>
                     </div>
                  ))}
               </div>

               <div className="flex flex-col mb-2">
                  <span>Fotos</span>
                  <input
                     type="file"
                     {...register('images', { required: true })}
                     multiple
                     className="p-2 border rounded-md bg-gray-200"
                     accept="image/png, image/jpeg, image/avif"
                  />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {product.ProductImage?.map((image) => (
                     <div key={image.id}>
                        <ProductImageComponent
                           src={`${image.url}`}
                           alt={product.title ?? ''}
                           width={500}
                           height={500}
                           className="rounded-t shadow-md w-full object-cover"
                        />
                        <button
                           type={'button'}
                           onClick={() =>
                              deleteProductImage(image.id, image.url)
                           }
                           className="btn-danger w-full rounded-b-xl"
                        >
                           Eliminar
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </form>
   );
};
