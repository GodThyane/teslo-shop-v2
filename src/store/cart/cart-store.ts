import { CartProduct } from '@/interfaces/product.interface';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
   cart: CartProduct[];

   // Obtener total de productos en el carrito
   getCartTotal: () => number;

   // Obtener el resumen de la información del carrito
   getSummaryInformation: () => {
      total: number;
      itemsInCart: number;
      tax: number;
      totalWithTax: number;
   };

   // Add a new product to the cart
   addToCart: (product: CartProduct) => void;

   // Update the quantity of a product in the cart
   updateProductInCart: (product: CartProduct, quantity: number) => void;

   // Remove a product from the cart
   removeFromCart: (product: CartProduct) => void;

   // Clear the cart
   clearCart: () => void;
}

export const useCartStore = create<State>()(
   persist(
      (set, get) => ({
         cart: [],
         // Methods

         addToCart: (product: CartProduct) => {
            let { cart } = get();

            const existingProductIndex = cart.findIndex(
               (item) => item.id === product.id && item.size === product.size
            );

            if (existingProductIndex === -1) {
               cart = [...cart, product];
            } else {
               cart[existingProductIndex].quantity += product.quantity;
            }
            set({ cart });
         },

         getCartTotal: () => {
            const { cart } = get();
            return cart.reduce((acc, item) => acc + item.quantity, 0);
         },

         getSummaryInformation: () => {
            const { cart } = get();
            const total = cart.reduce(
               (acc, item) => acc + item.price * item.quantity,
               0
            );
            const tax = total * 0.15;
            const totalWithTax = total + tax;
            const itemsInCart = cart.reduce(
               (acc, item) => acc + item.quantity,
               0
            );

            return {
               total,
               tax,
               totalWithTax,
               itemsInCart,
            };
         },

         updateProductInCart: (product: CartProduct, quantity: number) => {
            const { cart } = get();

            const updatedCartProducts = cart.map((item) => {
               if (item.id === product.id && item.size === product.size) {
                  return {
                     ...item,
                     quantity,
                  };
               }
               return item;
            });
            set({ cart: updatedCartProducts });
         },

         removeFromCart: (product: CartProduct) => {
            const { cart } = get();
            const updatedCartProducts = cart.filter(
               (item) => item.id !== product.id || item.size !== product.size
            );
            set({ cart: updatedCartProducts });
         },

         clearCart: () => {
            set({ cart: [] });
         },
      }),
      {
         name: 'shopping-cart',
      }
   )
);
