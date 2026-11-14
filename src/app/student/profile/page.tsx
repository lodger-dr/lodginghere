'use client';

import React, { useState } from 'react';
import { User, GraduationCap, Phone, Mail, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';

export default function StudentProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Student Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your personal details and university association.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription className="text-xs">
            Your name and phone number are shared with landlords only when you schedule an inspection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {saved && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Profile details saved successfully.</span>
              </div>
            )}

            <Input
              label="Full name"
              name="fullName"
              defaultValue="Daniel Okafor"
              required
            />

            <Input
              label="Email address"
              name="email"
              type="email"
              defaultValue="daniel.student@example.com"
              disabled
              helperText="Email cannot be changed directly"
            />

            <Input
              label="WhatsApp Phone Number"
              name="phone"
              type="tel"
              defaultValue="08149901234"
              placeholder="08149901234"
              helperText="For landlords to coordinate inspection arrival"
            />

            <Select label="Primary University">
              {NIGERIAN_UNIVERSITIES.slice(0, 15).map((u) => (
                <option key={u.slug} value={u.slug}>
                  {u.name} ({u.acronym})
                </option>
              ))}
            </Select>

            <Input
              label="Department / Faculty"
              name="department"
              defaultValue="Computer Science"
              placeholder="e.g. Computer Science"
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
