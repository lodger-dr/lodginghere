'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BedDouble,
  Plus,
  Building2,
  CheckCircle2,
  XCircle,
  Trash2,
  Filter,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  getLodges,
  fetchLodges,
  getRooms,
  fetchRooms,
  saveRoom,
  updateRoomStatus,
  deleteRoom,
} from '@/lib/data/lodges-data';
import { Room, Lodge, AccommodationType, RoomAvailabilityStatus } from '@/types/database';
import { formatNaira } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUploader } from '@/components/ui/image-uploader';

function RoomsContent() {
  const searchParams = useSearchParams();
  const initialPropertyId = searchParams.get('propertyId') || '';

  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(initialPropertyId);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for adding room
  const [roomNumber, setRoomNumber] = useState('');
  const [title, setTitle] = useState('Executive Self-Contained Unit');
  const [accommodationType, setAccommodationType] = useState<AccommodationType>('self_contained');
  const [annualRent, setAnnualRent] = useState('450000');
  const [featuresStr, setFeaturesStr] = useState('Private Bathroom, Kitchenette, Fitted Wardrobe, Prepaid Meter');
  const [status, setStatus] = useState<RoomAvailabilityStatus>('available');
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = () => {
    setLodges(getLodges());
    setRooms(getRooms(selectedPropertyId || undefined));
    fetchLodges().then((l) => setLodges(l));
    fetchRooms(selectedPropertyId || undefined).then((r) => setRooms(r));
  };

  useEffect(() => {
    loadData();
    const handleDataChange = () => {
      setLodges(getLodges());
      setRooms(getRooms(selectedPropertyId || undefined));
    };
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, [selectedPropertyId]);

  useEffect(() => {
    if (initialPropertyId) {
      setSelectedPropertyId(initialPropertyId);
    }
  }, [initialPropertyId]);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLodgeId = selectedPropertyId || lodges[0]?.id;
    if (!targetLodgeId) {
      setFormError('Please select or create a property first.');
      return;
    }
    if (!roomNumber.trim() || !annualRent) {
      setFormError('Please provide room number and annual rent.');
      return;
    }

    const features = featuresStr
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      property_id: targetLodgeId,
      room_number: roomNumber.trim(),
      title: title.trim(),
      accommodation_type: accommodationType,
      annual_rent: Number(annualRent) || 300000,
      total_units: 1,
      available_units: status === 'available' ? 1 : 0,
      status,
      features,
      images: roomImages,
      created_at: new Date().toISOString(),
    };

    saveRoom(newRoom);
    setIsAddModalOpen(false);
    setFormError(null);
    setRoomNumber('');
    setRoomImages([]);
  };

  const handleToggleStatus = (room: Room) => {
    const newStatus: RoomAvailabilityStatus =
      room.status === 'available' ? 'occupied' : 'available';
    updateRoomStatus(room.id, newStatus);
  };

  const handleDeleteRoom = (id: string, label: string) => {
    if (confirm(`Are you sure you want to delete room "${label}"?`)) {
      deleteRoom(id);
    }
  };

  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Room Inventory & Vacancy</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track individual unit availability, configure room codes, and toggle vacancy in real-time.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5 shadow-xs"
          disabled={lodges.length === 0}
        >
          <Plus className="h-4 w-4" />
          <span>Add Room Unit</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Configured Units</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{rooms.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <BedDouble className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Live Vacancies (Ready)</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{availableCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Currently Occupied</span>
              <p className="text-2xl font-black text-slate-700 dark:text-slate-300">{occupiedCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <XCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter by Property Dropdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <div className="space-y-0.5 flex-1 sm:flex-initial">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Filter By Lodge
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none min-w-[220px] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">All Lodges ({lodges.length})</option>
              {lodges.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedPropertyId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPropertyId('')}
            className="text-xs text-slate-500 dark:text-slate-400"
          >
            Show All Properties
          </Button>
        )}
      </div>

      {/* Rooms Table / Cards */}
      <div className="space-y-3">
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => {
              const isAvailable = room.status === 'available';
              const parentLodge = lodges.find((l) => l.id === room.property_id);

              return (
                <div
                  key={room.id}
                  className={`rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between space-y-4 ${isAvailable
                    ? 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                    : 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-850/60'
                    }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                          {parentLodge?.title || 'Lodge'}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                          {room.room_number}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{room.title}</p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${isAvailable
                          ? 'bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                      >
                        {isAvailable ? 'Vacant / Available' : 'Occupied'}
                      </span>
                    </div>

                    {/* Room Pictures Preview */}
                    {room.images && room.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto py-1">
                        {room.images.map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100"
                          >
                            <img
                              src={imgUrl}
                              alt={`${room.room_number} picture ${imgIdx + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Features Chips */}
                    {room.features && room.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {room.features.map((feat, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block uppercase">
                        Annual Rent
                      </span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {formatNaira(room.annual_rent)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isAvailable ? 'outline' : 'secondary'}
                        onClick={() => handleToggleStatus(room)}
                        className={`text-xs h-8 px-2.5 ${isAvailable
                          ? 'hover:border-amber-500 hover:text-amber-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                      >
                        {isAvailable ? 'Mark Occupied' : 'Mark Available'}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteRoom(room.id, room.room_number)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Delete Room"
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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <BedDouble className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">No rooms listed in inventory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Add specific room numbers (e.g. Room 101, Room 204) to your lodges to manage vacancies for student inspections.
              </p>
            </div>
            {lodges.length > 0 ? (
              <Button
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Add First Room</span>
              </Button>
            ) : (
              <Link href="/landlord/properties">
                <Button size="sm" className="gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span>Create a Property First</span>
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-5 border-t sm:border border-slate-200 dark:border-slate-800 dark:bg-slate-900 pb-safe animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Room Unit</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Attach a specific room to your property with its code, rent, and live vacancy status.
              </p>
            </div>

            {formError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/50 p-3 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Property *</label>
                <select
                  value={selectedPropertyId || lodges[0]?.id || ''}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  required
                >
                  {lodges.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title} ({l.neighbourhood})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Room Code / Number *</label>
                  <Input
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. Room 204 (First Floor)"
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Accommodation Type *</label>
                  <select
                    value={accommodationType}
                    onChange={(e) => setAccommodationType(e.target.value as AccommodationType)}
                    className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="self_contained">Self-Contained</option>
                    <option value="single_room">Single Room</option>
                    <option value="one_bedroom">1-Bedroom Flat</option>
                    <option value="two_bedroom">2-Bedroom Flat</option>
                    <option value="shared_apartment">Shared Apartment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Annual Rent (₦) *</label>
                  <Input
                    type="number"
                    value={annualRent}
                    onChange={(e) => setAnnualRent(e.target.value)}
                    placeholder="450000"
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RoomAvailabilityStatus)}
                    className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="available">Vacant & Ready</option>
                    <option value="occupied">Currently Occupied</option>
                    <option value="reserved_pending">Reserved / Pending</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Room Title / Description</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deluxe Balcony Self-Contained"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Features (Comma-separated)</label>
                <Input
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  placeholder="Private Bathroom, Fitted Wardrobe, Prepaid Meter"
                  className="text-xs"
                />
              </div>

              {/* Room Pictures Upload to lodge-images */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Room Pictures (Uploads to lodge-images bucket)
                </label>
                <ImageUploader
                  value={roomImages}
                  onChange={setRoomImages}
                  maxFiles={4}
                  bucketName="lodge-images"
                  folder="rooms"
                />
              </div>

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
                  Save Room Unit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LandlordRoomsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">Loading rooms...</div>}>
      <RoomsContent />
    </Suspense>
  );
}
