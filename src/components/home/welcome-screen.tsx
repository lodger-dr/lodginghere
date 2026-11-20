'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';

interface WelcomeScreenProps {
  onExplore?: () => void;
  onLogin?: () => void;
}

export function WelcomeScreen({ onExplore, onLogin }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#24272B] flex flex-col justify-between max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {/* Top Hero Image Area with Floating Emblem */}
      <div className="relative w-full h-[54vh] min-h-[380px] overflow-hidden bg-slate-900">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
          alt="Modern campus lodge accommodation"
          fill
          priority
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Ambient Dark-to-Translucent Gradient for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* Top Status Bar Placeholder */}
        <div className="absolute top-3 left-0 right-0 px-6 flex items-center justify-between text-white/90 text-xs font-semibold z-10">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 border border-white/80 rounded-xs p-0.5">
              <div className="w-full h-full bg-white rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Floating Brand Emblem & Logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4 -translate-y-4">
          <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center mb-3.5 border border-white/60 backdrop-blur-xs">
            <div className="h-14 w-14 rounded-full bg-[#FFF0E9] flex flex-col items-center justify-center text-[#F45B2A]">
              <Sparkles className="h-6 w-6 stroke-[2.5]" />
              <span className="text-[8px] font-black uppercase tracking-widest mt-0.5">Lodge</span>
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
            LODGEHERE
          </h2>
          <p className="text-xs font-medium text-white/90 tracking-widest uppercase mt-0.5 drop-shadow-sm">
            Student Accommodations
          </p>
        </div>
      </div>

      {/* Curved Convex White Card Overlay */}
      <div className="relative -mt-10 bg-white rounded-t-[38px] px-7 pt-8 pb-10 flex-1 flex flex-col justify-between shadow-2xl z-20">
        <div className="text-center space-y-3 pt-1">
          <h1 className="text-3xl font-black tracking-tight text-[#24272B]">
            WELCOME
          </h1>
          <p className="text-sm font-normal text-slate-500 leading-relaxed max-w-[280px] mx-auto">
            Find your next space, feel at home
            <br />
            <span className="text-slate-400">Where comfort meets convenience</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-6">
          <Link
            href="/login"
            onClick={onLogin}
            className="w-full py-4 rounded-full bg-[#24272B] hover:bg-black text-white font-bold text-sm transition-all duration-200 flex items-center justify-center shadow-md active:scale-[0.98] cursor-pointer"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="w-full py-4 rounded-full bg-white hover:bg-slate-50 text-[#24272B] font-bold text-sm border border-[#E8E8E5] transition-all duration-200 flex items-center justify-center shadow-xs active:scale-[0.98] cursor-pointer"
          >
            Sign Up
          </Link>

          {/* Quick Guest Explorer Link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onExplore}
              className="text-xs font-bold text-[#F45B2A] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore nearby lodges as guest</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
