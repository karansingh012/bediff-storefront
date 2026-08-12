"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/account");
      router.refresh();
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password");
      return;
    }
    setLoading(true);
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
    });
    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("Check your email for a password reset link");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center border-b border-border pb-6">
          <h1 className="text-2xl font-bold uppercase tracking-[0.1em] text-black">
            WELCOME BACK
          </h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL ADDRESS"
              required
              className="w-full px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              required
              className="w-full px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none"
            />
          </div>

          {error && (
            <div className="p-4 border border-red-500 bg-red-50 text-xs text-red-500 uppercase tracking-[0.05em] font-medium text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="p-4 border border-green-500 bg-green-50 text-xs text-green-700 uppercase tracking-[0.05em] font-medium text-center">
              {message}
            </div>
          )}

          <div className="text-right">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors flex items-center justify-center rounded-none disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "SIGN IN"}
          </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-border">
          <p className="text-xs uppercase tracking-[0.05em] text-gray-500 mb-4">
            Don't have an account?
          </p>
          <Link
            href="/account/signup"
            className="inline-block border-b border-black text-xs font-bold uppercase tracking-[0.05em] pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}
