'use client';

import React from 'react';
import Link from 'next/link';
import { FileCode2, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <FileCode2 className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" aria-hidden="true" />
            <span>Open Source &amp; Media Credits</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Licenses &amp; Attributions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            LodgeHere is built with world-class open-source typography, iconography, and photography. We gratefully
            acknowledge the creators and open-source licenses governing these assets.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Typography */}
          <section className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Typography: Inter Font Family</h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                SIL Open Font License 1.1
              </span>
            </div>
            <p>
              LodgeHere uses the <strong>Inter</strong> typeface designed by Rasmus Andersson.
              Inter is licensed under the SIL Open Font License, Version 1.1.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
              Copyright (c) 2016-2024 The Inter Project Authors (https://github.com/rsms/inter)
              <br /><br />
              This Font Software is licensed under the SIL Open Font License, Version 1.1.
              Permission is hereby granted, free of charge, to any person obtaining a copy of the Font Software,
              to use, study, copy, merge, embed, modify, redistribute, and sell modified and unmodified copies.
            </div>
          </section>

          {/* Iconography */}
          <section className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Iconography: Lucide Icons</h2>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                ISC License
              </span>
            </div>
            <p>
              Interface icons are supplied by the <strong>Lucide</strong> icon library (https://lucide.dev).
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
              Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT).
              All other copyright (c) 2022-2026 Lucide Contributors.
              <br /><br />
              Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
              provided that the above copyright notice and this permission notice appear in all copies.
            </div>
          </section>

          {/* Photography */}
          <section className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Photography &amp; Images</h2>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                Unsplash License
              </span>
            </div>
            <p>
              Demonstration campus lodge visuals and architectural photography are sourced from <strong>Unsplash</strong>.
              All images are published under the Unsplash License, granting irrevocable, nonexclusive copyright license to download,
              copy, modify, distribute, perform, and use photos for free, including for commercial purposes.
            </p>

            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white">Image Attributions &amp; Photographers:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hero Architectural Street: Photo by Brandon Griggs on Unsplash</li>
                <li>Emerald Haven Self-Con: Photo by Breather on Unsplash</li>
                <li>Oakwood Executive Studio: Photo by Sidekix Media on Unsplash</li>
                <li>Silvercrest Private Lodge: Photo by Francesca Tosolini on Unsplash</li>
                <li>Pinecrest Prime Suites: Photo by Sidekix Media on Unsplash</li>
                <li>Grand Vista Flat: Photo by Patrick Perkins on Unsplash</li>
                <li>Campus Edge Residency: Photo by Huy Nguyen on Unsplash</li>
                <li>Lodge Room Interior Preview: Photo by Sidekix Media on Unsplash</li>
              </ul>
            </div>
          </section>

          {/* Software & Frameworks */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Open Source Frameworks &amp; Libraries</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Next.js:</strong> MIT License — Copyright (c) 2026 Vercel, Inc.</li>
              <li><strong>React &amp; React-DOM:</strong> MIT License — Copyright (c) Meta Platforms, Inc.</li>
              <li><strong>Tailwind CSS:</strong> MIT License — Copyright (c) Tailwind Labs, Inc.</li>
              <li><strong>Supabase Client &amp; SSR:</strong> Apache 2.0 / MIT License — Copyright (c) Supabase, Inc.</li>
              <li><strong>Zod:</strong> MIT License — Copyright (c) 2020 Colin McDonnell</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
