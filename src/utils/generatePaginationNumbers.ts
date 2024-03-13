// [1,2,3,4,5,...,7]

export const generatePaginationNumbers = (
   currentPage: number,
   totalPages: number
) => {
   // Si el número total de páginas es menor o igual a 7
   // Mostrar todas las páginas
   if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1); // [1,2,3,4,5,6,7]
   }

   // Si la página actual está entre las primeras 3 páginas
   // Mostrar las primeras 3 páginas y las última 2 páginas
   if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages - 1, totalPages]; // [1,2,3,'...',49,50]
   }

   // Si la página actual está entre las últimas 3 páginas
   // Mostrar las primeras 2 páginas y las últimas 3 páginas
   if (currentPage > totalPages - 3) {
      return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]; // [1,2,'...',48,49,50]
   }

   // Si la página actual está entre las páginas intermedias
   // Mostrar las primera página, la página actual y las últimas 2 páginas
   return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
   ]; // [1,'...',4,5,6,'...',50]
};
