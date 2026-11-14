'use client';

import React, { useState } from 'react';
import { User, Building2, Phone, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandlordProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Landlord Profile</h1>
        <p className="text-xs text-slate-500">
          Manage your business information and communication contact details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provider Details</CardTitle>
          <CardDescription className="text-xs">
            These contact details are provided to students whose inspection requests you accept.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {saved && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Profile updated successfully.</span>
              </div>
            )}

            <Input
              label="Full Legal Name"
              name="fullName"
              defaultValue="Landlord User"
              required
            />

            <Input
              label="Business or Brand Name"
              name="businessName"
              placeholder="e.g. Skyline Student Residences"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              defaultValue="landlord@example.com"
              disabled
              helperText="Managed by authentication"
            />

            <Input
              label="Contact Phone / WhatsApp"
              name="phone"
              type="tel"
              defaultValue="08098765432"
              placeholder="08098765432"
              helperText="Used for coordinating arrival of inspecting students"
            />

            <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

