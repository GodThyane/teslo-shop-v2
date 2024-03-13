# Descripción

## Correr en dev

1. Clonar el repositorio
2. Crear una copia del ```.env.example``` y renombrarla a ```.env```
3. Instalar dependencias ```npm install```
4. Levantar la base de datos con ```docker-compose up -d```
5. Correr las migraciones de Prisma con ```npx prisma migrate dev```
6. Ejecutar seed ```npm run seed```
7. Limpiar el localStorage del navegador
8. Correr el proyecto ```npm run dev```
