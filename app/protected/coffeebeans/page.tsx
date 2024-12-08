import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

import AuthButton from '@/components/AuthButton';
import CoffeeBeansClient from '@/components/CoffeeBeansClient';


export default async function CoffeeBeansPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="w-full flex flex-col items-center">
     
      <AuthButton />
      <CoffeeBeansClient userid={user.id} />
    </div>
  );
}