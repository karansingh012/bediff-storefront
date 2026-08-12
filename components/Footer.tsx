"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    // Simulate API call for newsletter subscription
    setTimeout(() => {
      if (!email || !email.includes("@")) {
        setStatus("error");
        setMessage("Please enter a valid email address.");
        return;
      }
      
      // Simulate existing subscriber
      if (email === "test@test.com") {
        setStatus("error");
        setMessage("This email is already subscribed.");
        return;
      }

      setStatus("success");
      setMessage("Thank you. You have been added to the club.");
      setEmail("");
    }, 1000);
  };

  return (
    <footer className={`w-full bg-white border-t border-border pt-16 pb-8 px-4 md:px-6 md:pt-24 md:pb-12 ${className}`}>
      <div className="mx-auto max-w-content">
        
        {/* JOIN THE CLUB Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-border pb-16 mb-16 gap-10">
          <div className="flex flex-col gap-4 md:max-w-md">
            <h3 className="text-xl font-bold uppercase tracking-[0.1em] text-black">
              JOIN THE CLUB
            </h3>
            <p className="text-sm text-gray-500 uppercase tracking-[0.05em]">
              Get early access to BEDIFF product drops.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col gap-3">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full gap-4 sm:gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL ADDRESS"
                className="w-full sm:w-[300px] px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto px-8 py-3 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors flex items-center justify-center rounded-none disabled:opacity-50 min-w-[120px]"
              >
                {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : "JOIN"}
              </button>
            </form>
            
            {message && (
              <p className={`text-[10px] font-medium uppercase tracking-[0.05em] ${status === "error" ? "text-red-500" : "text-green-600"}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="flex flex-col md:flex-row justify-between md:gap-8">
          
          {/* Brand Block */}
          <div className="flex flex-col md:max-w-xs mb-8 md:mb-0">
            <span className="text-lg font-bold uppercase tracking-[0.18em] text-black mb-4">
              BEDIFF
            </span>
            <p className="text-[11px] uppercase tracking-[0.05em] text-gray-500 leading-relaxed">
              Independent performance athletic wear. Merging extreme functional requirements with pristine editorial design.
            </p>
          </div>

          {/* Nav Links Container */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:flex md:flex-row md:gap-24">
            
            {/* HELP Column */}
            <div className="flex flex-col gap-6">
              <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-black border-b border-black pb-2 inline-block max-w-fit">
                HELP
              </h4>
              <nav className="flex flex-col gap-4" aria-label="Help navigation">
                <Link href="/contact" className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors">Contact</Link>
                <Link href="/faq" className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors">FAQ</Link>
                <Link href="/shipping" className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors">Shipping & Returns</Link>
                <Link href="/returns" className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors">Returns</Link>
              </nav>
            </div>

            {/* INFO Column */}
            <div className="flex flex-col gap-6">
              <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-black border-b border-black pb-2 inline-block max-w-fit">
                INFO
              </h4>
              <nav className="flex flex-col gap-4" aria-label="Info navigation">
                <Link href="/about" className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors">About</Link>
                <Link href="/careers" className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors">Careers</Link>
                <Link href="/terms" className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors">Terms</Link>
                <Link href="/privacy" className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors">Privacy</Link>
              </nav>
            </div>

            {/* SOCIAL Column */}
            <div className="flex flex-col gap-6">
              <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-black border-b border-black pb-2 inline-block max-w-fit">
                SOCIAL
              </h4>
              <nav className="flex flex-col gap-4" aria-label="Social navigation">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors">Instagram</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors">X/Twitter</a>
                <a href="https://strava.com" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors">Strava</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-border flex justify-center md:justify-start items-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-gray-400">
            Copyright © 2026 BEDIFF
          </span>
        </div>
      </div>
    </footer>
  );
}
