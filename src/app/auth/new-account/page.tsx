import { titleFont } from '@/config/fonts';
import RegisterForm from '@/app/auth/new-account/ui/RegisterForm';

export default function NewAccountPage() {
   return (
      <div className="flex flex-col">
         <h1 className={`${titleFont.className} text-4xl mb-5`}>
            Nuevo usuario
         </h1>
         <RegisterForm />
      </div>
   );
}
