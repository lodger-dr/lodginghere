import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CalendarCheck,
  FileCheck2,
  CheckCircle2,
  Lock,
  Building2,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          How The Marketplace Operates
        </h1>
        <p className="text-base text-slate-500 max-w-2xl mx-auto">
          Our core product principle is simple: Trust before growth. We provide a transparent coordination layer
          from lodge discovery through physical inspection and a mutually confirmed room booking record.
        </p>
      </div>

      {/* 4 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-700">
              <CalendarCheck className="h-5 w-5" />
              <CardTitle className="text-lg">1. Inspection Before Booking</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 leading-relaxed space-y-2">
            <p>
              Students must physically inspect a lodge before submitting a booking request. You can schedule an inspection
              with a chosen date and time directly through the platform.
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Why? You should never commit to accommodation without seeing the actual condition, water supply, power, and road access yourself.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-700">
              <Building2 className="h-5 w-5" />
              <CardTitle className="text-lg">2. Room-Level Accuracy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 leading-relaxed space-y-2">
            <p>
              Availability is tracked at the specific room level, not just the building. Each listing itemizes room codes,
              bathrooms, individual rent, and occupancy status.
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Why? A lodge may have 10 rooms with only 2 currently vacant. You reserve the exact room code you inspected.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-700">
              <FileCheck2 className="h-5 w-5" />
              <CardTitle className="text-lg">3. Transparent All-Inclusive Costs</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 leading-relaxed space-y-2">
            <p>
              Every listing explicitly breaks down annual rent and all mandatory upfront charges: agency fee, legal/agreement
              fee, service charge, and caution deposit.
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Why? No surprise additional charges when you arrive to pay. You see the known total upfront cost before booking.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-700">
              <Lock className="h-5 w-5" />
              <CardTitle className="text-lg">4. Mutual Terms Confirmation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 leading-relaxed space-y-2">
            <p>
              Once an inspection is completed, the student can submit a booking request. The landlord confirms the terms snapshot,
              and both parties agree to the exact rental conditions.
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Note: The platform is a coordination marketplace and does not handle payments in MVP. Confirmation creates an accountable mutual record.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Verification Model Detail */}
      <div id="verification" className="rounded-2xl border border-slate-200 bg-white p-8 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            <ShieldCheck className="h-4 w-4" />
            <span>Verification Architecture</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Understanding Our Verification Model</h2>
          <p className="text-sm text-slate-600">
            We maintain three distinct indicators so students always know what has been checked and when:
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-1">
            <h4 className="font-bold text-sm text-blue-900">Identity Verified</h4>
            <p className="text-xs text-blue-800 leading-relaxed">
              The property provider has provided valid government identification that has been cross-checked by platform administrators.
            </p>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 space-y-1">
            <h4 className="font-bold text-sm text-purple-900">Property / Authority Verified</h4>
            <p className="text-xs text-purple-800 leading-relaxed">
              The landlord has provided legal title documents or written, signed authorization to manage and let the lodge on behalf of the owner.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-1">
            <h4 className="font-bold text-sm text-emerald-900">Availability Reconfirmed</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              The landlord has recently verified that the listed room remains vacant and the stated rent is current. Listings with stale availability are flagged.
            </p>
          </div>
        </div>
      </div>

      {/* Notice on Payments */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 flex items-start gap-4 text-xs text-amber-900">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm block">Important Payment & Tenancy Notice</span>
          <p className="leading-relaxed">
            The platform does not process deposits, rent collection, or financial checkout in this release. All booking
            confirmations are mutual coordination records of agreed rental terms. Never transfer money to unverified individuals
            or before physically inspecting the lodge and confirming room availability.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link href="/explore">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            Start Exploring Lodges Now
          </Button>
        </Link>
      </div>
    </div>
  );
}

