import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';

export default async function CheckoutLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <>{children}</>;
}
