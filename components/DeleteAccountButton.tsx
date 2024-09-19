"use client";

import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client"; 

export default function DeleteAccountButton() {
  const router = useRouter();

  
  const supabase = createClient();

  const deleteAccount = async () => {
    try {
      const { error } = await supabase.rpc('delete_user');

      if (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete your account.');
      } else {
        // After successful deletion, redirect the user
        router.push('/');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <button onClick={deleteAccount}>Delete Account</button>
  );
}
