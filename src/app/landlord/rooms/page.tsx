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
  getRooms,
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
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = () => {
    const allLodges = getLodges();
    setLodges(allLodges);
    setRooms(getRooms(selectedPropertyId || undefined));
  };

  useEffect(() => {
    loadData();
    const handleDataChange = () => loadData();
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
      images: [],
      created_at: new Date().toISOString(),
    };

    saveRoom(newRoom);
    setIsAddModalOpen(false);
    setFormError(null);
    setRoomNumber('');
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Room Inventory & Vacancy</h1>
          <p className="text-xs text-slate-500">
            Track individual unit availability, configure room codes, and toggle vacancy in real-time.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 shadow-xs"
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
              <span className="text-xs font-semibold text-slate-500">Total Configured Units</span>
              <p className="text-2xl font-black text-slate-900">{rooms.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <BedDouble className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-700">Live Vacancies (Ready)</span>
              <p className="text-2xl font-black text-emerald-600">{availableCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Currently Occupied</span>
              <p className="text-2xl font-black text-slate-700">{occupiedCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <XCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter by Property Dropdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="space-y-0.5 flex-1 sm:flex-initial">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Filter By Lodge
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none min-w-[220px]"
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
            className="text-xs text-slate-500"
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
                  className={`rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between space-y-4 ${
                    isAvailable
                      ? 'border-emerald-200 bg-white hover:border-emerald-300'
                      : 'border-slate-200 bg-slate-50/70'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {parentLodge?.title || 'Lodge'}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 pt-1">
                          {room.room_number}
                        </h3>
                        <p className="text-xs text-slate-500">{room.title}</p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isAvailable ? 'Vacant / Available' : 'Occupied'}
                      </span>
                    </div>

                    {/* Features Chips */}
                    {room.features && room.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {room.features.map((feat, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                        Annual Rent
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        {formatNaira(room.annual_rent)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isAvailable ? 'outline' : 'secondary'}
                        onClick={() => handleToggleStatus(room)}
                        className={`text-xs h-8 px-2.5 ${
                          isAvailable
                            ? 'hover:border-amber-500 hover:text-amber-700'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {isAvailable ? 'Mark Occupied' : 'Mark Available'}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteRoom(room.id, room.room_number)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
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
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BedDouble className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-sm text-slate-900">No rooms listed in inventory</h3>
              <p className="text-xs text-slate-500">
                Add specific room numbers (e.g. Room 101, Room 204) to your lodges to manage vacancies for student inspections.
              </p>
            </div>
            {lodges.length > 0 ? (
              <Button
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Add First Room</span>
              </Button>
            ) : (
              <Link href="/landlord/properties">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Add Room Unit</h3>
              <p className="text-xs text-slate-500">
                Attach a specific room to your property with its code, rent, and live vacancy status.
              </p>
            </div>

            {formError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Select Property *</label>
                <select
                  value={selectedPropertyId || lodges[0]?.id || ''}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
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
                  <label className="text-xs font-semibold text-slate-700">Room Code / Number *</label>
                  <Input
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. Room 204 (First Floor)"
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Accommodation Type *</label>
                  <select
                    value={accommodationType}
                    onChange={(e) => setAccommodationType(e.target.value as AccommodationType)}
                    className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
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
                  <label className="text-xs font-semibold text-slate-700">Annual Rent (₦) *</label>
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
                  <label className="text-xs font-semibold text-slate-700">Current Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RoomAvailabilityStatus)}
                    className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="available">Vacant & Ready</option>
                    <option value="occupied">Currently Occupied</option>
                    <option value="reserved_pending">Reserved / Pending</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Room Title / Description</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deluxe Balcony Self-Contained"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Features (Comma-separated)</label>
                <Input
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  placeholder="Private Bathroom, Fitted Wardrobe, Prepaid Meter"
                  className="text-xs"
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
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
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
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading rooms...</div>}>
      <RoomsContent />
    </Suspense>
  );
}
