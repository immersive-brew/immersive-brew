"use client";

import { useRouter } from "next/navigation";

export default function LoginRedirectButton({ children, className }) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/login");
  };

  return (
    <button onClick={handleRedirect} className={className}>
      {children}
    </button>
  );
}
