import { initialData } from './seed';
import { prisma } from '../lib/prisma';
import { countries } from './seed-countries';

async function main() {
   console.log('Seeding database...');

   //1. Empty the database

   await prisma.orderAddress.deleteMany();
   await prisma.orderItem.deleteMany();
   await prisma.order.deleteMany();

   await prisma.user.deleteMany();
   await prisma.country.deleteMany();
   await prisma.productImage.deleteMany();
   await prisma.product.deleteMany();
   await prisma.category.deleteMany();
   console.log('Deleted all data');

   // Insert Countries
   console.log('Inserting countries...');
   await prisma.country.createMany({
      data: countries,
   });

   console.log('Inserted countries');

   // Insert Users
   console.log('Inserting users...');
   await prisma.user.createMany({
      data: initialData.users,
   });

   console.log('Inserted users');

   //2. Insert Categories
   console.log('Inserting categories...');
   const categories = initialData.categories.map((name) => ({
      name,
   }));

   await prisma.category.createMany({
      data: categories,
   });
   console.log('Inserted categories');
   const categoriesDB = await prisma.category.findMany();
   const categoriesMap = categoriesDB.reduce(
      (map, category) => {
         map[category.name.toLowerCase()] = category.id;
         return map;
      },
      {} as Record<string, string> // <shirt, idDb>
   );

   //3. Insert Products with images
   console.log('Inserting product and images...');

   for (const product of initialData.products) {
      const { type, images, ...rest } = product;

      const dbProduct = await prisma.product.create({
         data: {
            ...rest,
            categoryId: categoriesMap[type],
         },
      });

      //3.1 Insert Product Images
      const imagesData = images.map((image) => ({
         url: image,
         productId: dbProduct.id,
      }));

      await prisma.productImage.createMany({
         data: imagesData,
      });
   }

   console.log('Inserted product and images');
}

(() => {
   if (process.env.NODE_ENV === 'production') return;
   main();
})();
