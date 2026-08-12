"use client";

import { useState } from "react";

interface NewsletterProps {
  className?: string;
}

export default function Newsletter({ className = "" }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setEmail("");
      setMessage("Thank you for subscribing.");
      
      // Reset success message after a few seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <section className={`w-full bg-white py-24 md:py-32 px-4 ${className}`}>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-[0.1em] text-black">
          JOIN BEDIFF
        </h2>
        <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
          Subscribe to receive exclusive early product drops, athlete profiles, and technological insights.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col items-center">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
            <label htmlFor="email-input" className="sr-only">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
              placeholder="EMAIL ADDRESS"
              className="w-full md:w-80 px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full md:w-auto px-8 py-3 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors rounded-none whitespace-nowrap disabled:opacity-50"
            >
              {status === "loading" ? "SUBSCRIBING..." : status === "success" ? "SUBSCRIBED" : "SUBSCRIBE"}
            </button>
          </div>
          
          {message && (
            <div className={`mt-4 text-xs font-medium uppercase tracking-[0.05em] ${status === "error" ? "text-red-500" : "text-green-600"}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
