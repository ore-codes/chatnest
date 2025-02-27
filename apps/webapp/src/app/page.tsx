"use client";

import useRxState from "@/lib/storage/useRxState";
import { authService } from "@/lib/auth/AuthService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useRxState(authService.isAuthenticated$);

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      router.replace(isAuthenticated ? "/dashboard" : "/login");
    }
  }, [isAuthenticated]);

  return (
    <main className="grid h-screen w-screen place-items-center">
      <div className="animate-bounce !text-5xl text-primary font-bold">
        Loading...
      </div>
    </main>
  );
}
