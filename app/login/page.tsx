"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isRevealed, setIsRevealed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Focus effect for the glow
  useEffect(() => {
    document.body.style.backgroundColor = isRevealed ? "#f8fafc" : "#ffffff";
    return () => {
      document.body.style.backgroundColor = ""; // Reset on unmount
    };
  }, [isRevealed]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setIsLoading(true);
    // Simulate network delay for a premium feel
    await new Promise((r) => setTimeout(r, 800));
    
    // Set dummy auth cookie valid for 7 days
    document.cookie = `almaster-auth=true; path=/; max-age=${60 * 60 * 24 * 7}`;
    router.push("/client-relations-management");
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center transition-all duration-1000 ease-in-out relative overflow-hidden ${
        isRevealed ? "bg-slate-50" : "bg-white"
      }`}
    >
      {/* Animated gradient background (subtle) */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white" />
      
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
        {/* The interactive container */}
        <div
          className={`relative flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isRevealed ? "gap-12 md:gap-24 flex-col md:flex-row" : "gap-0"
          }`}
        >
          {/* Logo Section */}
          <div
            className={`flex flex-col items-center justify-center cursor-pointer transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              !isRevealed ? "hover:scale-110" : "scale-100 cursor-default"
            }`}
            onClick={() => {
              if (!isRevealed) setIsRevealed(true);
            }}
          >
            {/* The Mark */}
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-full blur-[60px] transition-all duration-1000 ${
                  isRevealed
                    ? "bg-[#0047ff]/5 w-[200%] h-[200%] -left-1/2 -top-1/2"
                    : "bg-[#0047ff]/30 w-[150%] h-[150%] -left-1/4 -top-1/4 animate-pulse"
                }`}
              />
              <Image
                src="/images/logo-mark.png"
                alt="AlMaster Logo Mark"
                width={300}
                height={300}
                className="relative z-10 object-contain drop-shadow-xl"
                priority
              />
            </div>
            
            {/* The Full Text appearing beneath */}
            <div
              className={`overflow-hidden transition-all duration-1000 ease-in-out flex justify-center mt-6 ${
                isRevealed ? "opacity-100 max-h-[80px]" : "opacity-0 max-h-0"
              }`}
            >
              <h1 className="text-3xl font-black text-[#0047ff] tracking-tight drop-shadow-sm">AlMASTER</h1>
            </div>
          </div>

          {/* Login Form Section */}
          <div
            className={`transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isRevealed
                ? "opacity-100 translate-x-0 blur-none pointer-events-auto"
                : "opacity-0 translate-x-12 blur-md pointer-events-none absolute"
            }`}
          >
            <div className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[24px] shadow-[0_30px_60px_-15px_rgba(0,71,255,0.1)] w-[360px] md:w-[420px]">
              <div className="flex flex-col gap-2 text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
                <p className="text-sm font-medium text-slate-500">
                  Please sign in to access the system
                </p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full h-12 bg-white/50 border border-slate-200 rounded-[12px] px-4 text-sm font-medium outline-none focus:border-[#0047ff] focus:ring-4 focus:ring-[#0047ff]/10 transition-all placeholder:font-normal"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("Please contact the administrator to reset your password.")}
                      className="text-xs font-bold text-[#0047ff] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-12 bg-white/50 border border-slate-200 rounded-[12px] px-4 pr-12 text-sm font-medium outline-none focus:border-[#0047ff] focus:ring-4 focus:ring-[#0047ff]/10 transition-all placeholder:font-normal"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none p-1"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !username || !password}
                  className="mt-4 w-full h-12 rounded-[12px] bg-gradient-to-r from-[#0047ff] to-[#002fcc] text-white font-bold text-sm shadow-lg shadow-[#0047ff]/30 hover:shadow-[#0047ff]/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
