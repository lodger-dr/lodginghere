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
import { useAuth } from '@/context/auth-context';

export default function LandlordPropertiesPage() {
  const { user, profile } = useAuth();
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
      landlord_id: user?.id || 'landlord-current',
      landlord_name: profile?.full_name || user?.user_metadata?.full_name || 'Verified Landlord (You)',
      landlord_phone: profile?.phone || user?.user_metadata?.phone || '',
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Properties</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create and manage your student lodge listings, set transparent upfront pricing, and monitor vacancies.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5 shadow-xs"
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
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Lodges</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{lodges.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Rooms Managed</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{totalRooms}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <BedDouble className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Available Vacancies</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{totalAvailable}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Your Property Portfolio</h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">All prices shown with zero agent inflation</span>
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
                  className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col"
                >
                  <div className="relative aspect-16/9 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={primaryImage}
                      alt={`Listing photograph for ${lodge.title}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/90 dark:bg-slate-800/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-md">
                        <ShieldCheck className="h-3 w-3 text-blue-400" />
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
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {lodge.distance_to_campus}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{lodge.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{lodge.address}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                          Annual Rent
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatNaira(lodge.pricing.min_price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                          University
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px] block">
                          {lodge.university_name}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/landlord/rooms?propertyId=${lodge.id}`}>
                          <Button size="sm" variant="outline" className="text-xs h-8 px-2.5 gap-1 text-slate-700 dark:text-slate-300">
                            <BedDouble className="h-3.5 w-3.5" />
                            <span>Rooms ({lodge.total_rooms})</span>
                          </Button>
                        </Link>
                        <Link href={`/lodges/${lodge.slug}`}>
                          <Button size="sm" variant="ghost" className="text-xs h-8 px-2 gap-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Preview</span>
                          </Button>
                        </Link>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(lodge.id, lodge.title)}
                        className="text-xs h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
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
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">No properties added yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                List your student lodge with transparent upfront fees and photos to start receiving inspection requests.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Listing</span>
            </Button>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-5 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 my-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New Student Lodge</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provide clear details and strictly transparent pricing. Listings appear instantly for inspection booking.
              </p>
            </div>

            {formError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/50 p-3 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateLodge} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Lodge Name *</label>
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
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">University *</label>
                  <select
                    value={universitySlug}
                    onChange={(e) => setUniversitySlug(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {NIGERIAN_UNIVERSITIES.map((u) => (
                      <option key={u.slug} value={u.slug}>
                        {u.name} ({u.acronym})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Campus / Campus Gate</label>
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
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Neighbourhood / Area *</label>
                  <Input
                    value={neighbourhood}
                    onChange={(e) => setNeighbourhood(e.target.value)}
                    placeholder="e.g. Akoka, Yaba"
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Distance to Campus *</label>
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
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Street Address *</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 18 Community Road, Akoka, Yaba, Lagos"
                  className="text-xs"
                  required
                />
              </div>

              {/* Transparent Financials */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-850">
                <span className="text-xs font-bold text-slate-800 dark:text-white block">
                  Transparent Upfront Pricing (Per Annum)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Base Annual Rent (₦) *</label>
                    <Input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="450000"
                      className="text-xs bg-white dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Caution Deposit (₦)</label>
                    <Input
                      type="number"
                      value={cautionDeposit}
                      onChange={(e) => setCautionDeposit(e.target.value)}
                      placeholder="40000"
                      className="text-xs bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Service Charge (₦)</label>
                    <Input
                      type="number"
                      value={serviceCharge}
                      onChange={(e) => setServiceCharge(e.target.value)}
                      placeholder="30000"
                      className="text-xs bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Zero middleman agency commission: LodgeHere direct landlord model is designed to eliminate unauthorized agent markups.
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Available Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_CATALOG.map((a) => {
                    const isSelected = selectedAmenities.includes(a.key);
                    return (
                      <button
                        key={a.key}
                        type="button"
                        onClick={() => toggleAmenity(a.key)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${isSelected
                          ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750'
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
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Property Photos (Real Upload to Storage)
                </label>
                <ImageUploader
                  value={images}
                  onChange={setImages}
                  maxFiles={6}
                  bucketName="lodge-images"
                  folder="lodges"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Form Consent Checkbox */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  id="landlord-listing-consent"
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                />
                <label htmlFor="landlord-listing-consent" className="text-xs text-slate-700 dark:text-slate-300 leading-snug cursor-pointer">
                  I confirm that all stated rents and fees are transparent with zero unadvertised charges, and that I have legal authority to list this property in accordance with the{' '}
                  <a href="/terms" target="_blank" className="text-blue-600 underline dark:text-blue-400 font-semibold">
                    Terms of Service
                  </a>.
                </label>
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
                <Button type="submit" size="sm">
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
