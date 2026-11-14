'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  BedDouble,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Trash2,
  Edit3,
  CalendarCheck,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { getLodges, fetchLodges, saveLodge, deleteLodge, AMENITIES_CATALOG, DEFAULT_LANDLORD_ID } from '@/lib/data/lodges-data';
import { Lodge, AmenityKey, AccommodationType, ListingStatus } from '@/types/database';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { formatNaira } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUploader } from '@/components/ui/image-uploader';

export default function LandlordPropertiesPage() {
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for adding a lodge
  const [title, setTitle] = useState('');
  const [universitySlug, setUniversitySlug] = useState('university-of-lagos');
  const [campusName, setCampusName] = useState('Akoka Main Campus');
  const [neighbourhood, setNeighbourhood] = useState('Akoka, Yaba');
  const [address, setAddress] = useState('');
  const [distanceToCampus, setDistanceToCampus] = useState('5 mins walk from Campus Gate');
  const [accommodationType, setAccommodationType] = useState<AccommodationType>('self_contained');
  const [minPrice, setMinPrice] = useState('450000');
  const [cautionDeposit, setCautionDeposit] = useState('40000');
  const [serviceCharge, setServiceCharge] = useState('30000');
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityKey[]>([
    'running_water',
    'solar_inverter',
    'security_guard',
    'gated_compound',
  ]);
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState(
    'Modern, secure student accommodation with continuous water supply, backup solar power, and close proximity to campus gate.'
  );
  const [formError, setFormError] = useState<string | null>(null);

  const loadLodges = () => {
    setLodges(getLodges());
    fetchLodges().then((data) => setLodges(data));
  };

  useEffect(() => {
    loadLodges();
    const handleDataChange = () => {
      setLodges(getLodges());
    };
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  const toggleAmenity = (key: AmenityKey) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCreateLodge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim() || !minPrice) {
      setFormError('Please fill in the property title, address, and annual rent.');
      return;
    }

    const selectedUni = NIGERIAN_UNIVERSITIES.find((u) => u.slug === universitySlug);
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const newLodge: Lodge = {
      id: `lodge-${Date.now()}`,
      title: title.trim(),
      slug,
      description: description.trim(),
      landlord_id: 'landlord-current',
      landlord_name: 'Chief Adebayo Olanrewaju (You)',
      landlord_phone: '+234 803 234 5678',
      landlord_verified: true,
      university_slug: universitySlug,
      university_name: selectedUni?.name || 'University of Lagos',
      campus_name: campusName.trim(),
      neighbourhood: neighbourhood.trim(),
      address: address.trim(),
      distance_to_campus: distanceToCampus.trim(),
      accommodation_type: accommodationType,
      pricing: {
        min_price: Number(minPrice) || 300000,
        max_price: (Number(minPrice) || 300000) + 50000,
        caution_deposit: Number(cautionDeposit) || 0,
        service_charge: Number(serviceCharge) || 0,
        legal_agency_fee: 0,
      },
      amenities: selectedAmenities,
      images: images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      ],
      status: 'approved',
      rating: 5.0,
      review_count: 1,
      total_rooms: 0,
      available_rooms: 0,
      created_at: new Date().toISOString(),
    };

    saveLodge(newLodge);
    setIsAddModalOpen(false);
    setFormError(null);
    setImages([]);
    // Reset basic fields
    setTitle('');
    setAddress('');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteLodge(id);
    }
  };

  const totalRooms = lodges.reduce((acc, l) => acc + (l.total_rooms || 0), 0);
  const totalAvailable = lodges.reduce((acc, l) => acc + (l.available_rooms || 0), 0);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Properties</h1>
          <p className="text-xs text-slate-500">
            Create and manage your student lodge listings, set transparent upfront pricing, and monitor vacancies.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Property</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Active Lodges</span>
              <p className="text-2xl font-black text-slate-900">{lodges.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Total Rooms Managed</span>
              <p className="text-2xl font-black text-slate-900">{totalRooms}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BedDouble className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Available Vacancies</span>
              <p className="text-2xl font-black text-emerald-600">{totalAvailable}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Your Property Portfolio</h2>
          <span className="text-xs text-slate-400">All prices shown with zero agent inflation</span>
        </div>

        {lodges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lodges.map((lodge) => {
              const primaryImage =
                lodge.images[0] ||
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={lodge.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs flex flex-col"
                >
                  <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={primaryImage}
                      alt={lodge.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Active Listing</span>
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                        {lodge.available_rooms} of {lodge.total_rooms} Vacant
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col space-y-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {lodge.distance_to_campus}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 truncate">{lodge.title}</h3>
                      <p className="text-xs text-slate-500 truncate">{lodge.address}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Annual Rent
                        </span>
                        <span className="font-bold text-slate-900">
                          {formatNaira(lodge.pricing.min_price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          University
                        </span>
                        <span className="font-bold text-slate-700 truncate max-w-[120px] block">
                          {lodge.university_name}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/landlord/rooms?propertyId=${lodge.id}`}>
                          <Button size="sm" variant="outline" className="text-xs h-8 px-2.5 gap-1 text-slate-700">
                            <BedDouble className="h-3.5 w-3.5" />
                            <span>Rooms ({lodge.total_rooms})</span>
                          </Button>
                        </Link>
                        <Link href={`/lodges/${lodge.slug}`}>
                          <Button size="sm" variant="ghost" className="text-xs h-8 px-2 gap-1 text-emerald-700 hover:bg-emerald-50">
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Preview</span>
                          </Button>
                        </Link>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(lodge.id, lodge.title)}
                        className="text-xs h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Property"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-sm text-slate-900">No properties added yet</h3>
              <p className="text-xs text-slate-500">
                List your student lodge with transparent upfront fees and photos to start receiving inspection requests.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Listing</span>
            </Button>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-200 my-8">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Add New Student Lodge</h3>
              <p className="text-xs text-slate-500">
                Provide clear details and strictly transparent pricing. Listings appear instantly for inspection booking.
              </p>
            </div>

            {formError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateLodge} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Lodge Name *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Heights Executive Villa"
                  className="text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">University *</label>
                  <select
                    value={universitySlug}
                    onChange={(e) => setUniversitySlug(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    {NIGERIAN_UNIVERSITIES.map((u) => (
                      <option key={u.slug} value={u.slug}>
                        {u.name} ({u.acronym})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Campus / Campus Gate</label>
                  <Input
                    value={campusName}
                    onChange={(e) => setCampusName(e.target.value)}
                    placeholder="e.g. Akoka Main Campus / Back Gate"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Neighbourhood / Area *</label>
                  <Input
                    value={neighbourhood}
                    onChange={(e) => setNeighbourhood(e.target.value)}
                    placeholder="e.g. Akoka, Yaba"
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Distance to Campus *</label>
                  <Input
                    value={distanceToCampus}
                    onChange={(e) => setDistanceToCampus(e.target.value)}
                    placeholder="e.g. 5 mins walk from UNILAG Gate"
                    className="text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Street Address *</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 18 Community Road, Akoka, Yaba, Lagos"
                  className="text-xs"
                  required
                />
              </div>

              {/* Transparent Financials */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Transparent Upfront Pricing (Per Annum)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Base Annual Rent (₦) *</label>
                    <Input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="450000"
                      className="text-xs bg-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Caution Deposit (₦)</label>
                    <Input
                      type="number"
                      value={cautionDeposit}
                      onChange={(e) => setCautionDeposit(e.target.value)}
                      placeholder="40000"
                      className="text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Service Charge (₦)</label>
                    <Input
                      type="number"
                      value={serviceCharge}
                      onChange={(e) => setServiceCharge(e.target.value)}
                      placeholder="30000"
                      className="text-xs bg-white"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-emerald-700 font-medium">
                  Zero legal/agency commission: LodgeHere direct landlord model guarantees zero agent exploitation.
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Available Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_CATALOG.map((a) => {
                    const isSelected = selectedAmenities.includes(a.key);
                    return (
                      <button
                        key={a.key}
                        type="button"
                        onClick={() => toggleAmenity(a.key)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real Property Images Upload via Supabase Storage */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Property Photos (Real Upload to Storage)
                </label>
                <ImageUploader
                  value={images}
                  onChange={setImages}
                  maxFiles={6}
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Save & Publish Property
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
