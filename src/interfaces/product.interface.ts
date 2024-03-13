export interface Product {
   id: string;
   description: string;
   images: string[];
   inStock: number;
   price: number;
   sizes: SizeProduct[];
   slug: string;
   tags: string[];
   title: string;
   /*type: TypeProduct;*/
   gender: Gender;
   categoryId: string;
}

export interface CartProduct {
   id: string;
   slug: string;
   title: string;
   price: number;
   quantity: number;
   size: SizeProduct;
   image: string;
}

export type Gender = 'men' | 'women' | 'kid' | 'unisex';
export type SizeProduct = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type TypeProduct = 'shirts' | 'pants' | 'hoodies' | 'hats';
