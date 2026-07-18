"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { SITE_NAME_SHORT } from "@/lib/brand";
import WatchLogo from "@/components/ui/WatchLogo";
import TypewriterRotate from "@/components/ui/TypewriterRotate";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ld-black">
      {/* Brand panel */}
      <div className="hidden lg:flex relative flex-col items-center justify-center p-12 bg-gradient-to-br from-ld-charcoal via-ld-dark to-ld-black border-r border-ld-gold/10 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] bg-ld-gold/15 rounded-full blur-3xl" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-ld-gold) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative text-center"
        >
          <div className="flex justify-center mb-8 px-4">
            <WatchLogo size="hero" />
          </div>

          <h1 className="sr-only">{SITE_NAME_SHORT} WATCHES Admin</h1>

          <p className="text-ld-gold-light text-lg mb-2 tracking-wide">
            <TypewriterRotate
              words={["Admin Portal", "Manage Collection", "Curate Timepieces"]}
              className="text-ld-gold-light"
              typingSpeed={70}
              deletingSpeed={40}
              pauseDuration={1800}
            />
          </p>

          <p className="text-ld-silver text-sm max-w-xs mx-auto leading-relaxed">
            Sign in to manage your watch inventory, upload new pieces, and keep your collection up to date.
          </p>
        </motion.div>
      </div>

      {/* Login form */}
      <div className="flex items-center justify-center px-4 py-12 relative">
        <div className="absolute inset-0 lg:hidden opacity-15">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-ld-gold/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <div className="text-center mb-8 lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 lg:hidden">
              <WatchLogo size="admin" />
              <span className="font-[family-name:var(--font-display)] text-xl font-bold text-white sr-only">
                {SITE_NAME_SHORT} <span className="text-gradient-gold">Admin</span>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1 hidden lg:block">Welcome back</h2>
            <p className="text-ld-silver text-sm">Sign in to manage your watch collection</p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-xl p-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-ld-light text-sm mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ld-silver" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-ld-charcoal border border-ld-grey/50 rounded-lg text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/50 transition-colors"
                  placeholder="admin@ldwatches.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-ld-light text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ld-silver" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-ld-charcoal border border-ld-grey/50 rounded-lg text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-ld-gold text-ld-black font-semibold rounded-lg hover:bg-ld-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
