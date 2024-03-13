import { titleFont } from '@/config/fonts';
import LoginForm from '@/app/auth/login/ui/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
   return (
      <div className="flex flex-col">
         <h1 className={`${titleFont.className} text-4xl mb-5`}>
            Iniciar sesión
         </h1>
         <Suspense>
            <LoginForm />
         </Suspense>
      </div>
   );
}
