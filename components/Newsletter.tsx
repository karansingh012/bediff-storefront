"use client";

import { useState } from "react";

interface NewsletterProps {
  className?: string;
}

export default function Newsletter({ className = "" }: NewsletterProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Local submission handler placeholder for Phase 1
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col md:flex-row gap-4 justify-center items-center">
          <label htmlFor="email-input" className="sr-only">
            Email Address
          </label>
          <input
            id="email-input"
            type="email"
            required
            placeholder="EMAIL ADDRESS"
            className="w-full md:w-80 px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none transition-colors"
          />
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors rounded-none whitespace-nowrap"
          >
            {submitted ? "SUBSCRIBED" : "SUBSCRIBE"}
          </button>
        </form>
      </div>
    </section>
  );
}
