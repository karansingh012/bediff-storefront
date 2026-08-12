"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogOutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="text-left text-xs font-bold uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors disabled:opacity-50"
    >
      {loading ? "LOGGING OUT..." : "LOG OUT"}
    </button>
  );
}
