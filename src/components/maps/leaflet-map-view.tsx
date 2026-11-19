'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Navigation, MapPin, Crosshair, GraduationCap, Home } from 'lucide-react';
import { Lodge } from '@/types/database';
import { formatNaira } from '@/lib/utils';
import {
  getUniversityCoordinates,
  getLodgeCoordinates,
  getGoogleMapsDirectionsUrl,
  Coordinates,
} from '@/lib/data/maps-data';

export interface LeafletMapViewProps {
  lodges?: Lodge[];
  singleLodge?: Lodge;
  universitySlug?: string;
  selectedLodgeId?: string;
  onSelectLodge?: (lodge: Lodge) => void;
  className?: string;
  showDirectionsButton?: boolean;
  height?: string;
  zoom?: number;
  radiusMiles?: number;
  centerCoordinates?: Coordinates;
  centerName?: string;
  showGpsButton?: boolean;
  isGpsActive?: boolean;
  onGpsClick?: () => void;
}

export function LeafletMapView({
  lodges,
  singleLodge,
  universitySlug,
  selectedLodgeId,
  onSelectLodge,
  className = '',
  showDirectionsButton = true,
  height = '420px',
  zoom,
  radiusMiles = 5,
  centerCoordinates,
  centerName,
  showGpsButton = false,
  isGpsActive = false,
  onGpsClick,
}: LeafletMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [activeLodge, setActiveLodge] = useState<Lodge | null>(singleLodge || null);

  const activeUniSlug =
    singleLodge?.university_slug ||
    universitySlug ||
    lodges?.[0]?.university_slug ||
    'abia-state-university';

  const uniLocation = getUniversityCoordinates(activeUniSlug);
  const mapCenter = centerCoordinates || uniLocation;
  const schoolDisplayName = centerName || uniLocation.campusName.replace('Main Gate', '').replace('Gate', '').trim() || 'University Campus';

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initial center point
      const initialCenter: Coordinates = singleLodge
        ? getLodgeCoordinates(singleLodge)
        : mapCenter;

      const mapZoomLevel = zoom || (singleLodge ? 16 : radiusMiles === 10 ? 12 : 13.5);

      const map = L.map(mapContainerRef.current, {
        center: [initialCenter.lat, initialCenter.lng],
        zoom: mapZoomLevel,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // TomTom Orbis Display Raster Tiles (512x512)
      const tomtomApiKey =
        process.env.NEXT_PUBLIC_TOMTOM_API_KEY ||
        process.env.TOM_TOM_API_KEY ||
        process.env.NEXT_PUBLIC_TOM_TOM_API_KEY ||
        '';

      if (tomtomApiKey) {
        L.tileLayer(
          `https://api.tomtom.com/maps/orbis/display/raster/tile/{z}/{x}/{y}?apiVersion=2&tileSize=512&key=${tomtomApiKey}`,
          {
            maxZoom: 22,
            minZoom: 1,
            tileSize: 512,
            zoomOffset: -1,
            attribution:
              '&copy; <a href="https://www.tomtom.com" target="_blank" rel="noopener noreferrer">TomTom</a>',
          }
        ).addTo(map);
      } else {
        // Fallback: CartoDB Voyager / OpenStreetMap Tile Layer
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 19,
            subdomains: 'abcd',
            attribution: '&copy; OpenStreetMap contributors',
          }
        ).addTo(map);
      }

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      // Search Radius Circle (5 mi or 10 mi)
      if (radiusMiles && !singleLodge) {
        const radiusMeters = radiusMiles * 1609.34;
        L.circle([mapCenter.lat, mapCenter.lng], {
          radius: radiusMeters,
          color: '#F45B2A',
          fillColor: '#DDE6DF',
          fillOpacity: 0.18,
          weight: 1.5,
          dashArray: '5, 5',
        }).addTo(markersLayer);
      }

      // Center University / Anchor Landmark Marker (Navy Blue Pin with Cap)
      const campusIcon = L.divIcon({
        className: 'custom-campus-marker',
        html: `
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E3A5F] text-white border-2 border-white shadow-xl text-xs font-black whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2 cursor-default select-none">
            <svg class="w-4 h-4 text-blue-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
            </svg>
            <span>${schoolDisplayName}</span>
          </div>
        `,
        iconSize: [0, 0],
      });

      L.marker([mapCenter.lat, mapCenter.lng], { icon: campusIcon })
        .bindTooltip(`<strong>${schoolDisplayName}</strong><br/>Primary Discovery Anchor`, {
          direction: 'top',
          offset: [0, -12],
        })
        .addTo(markersLayer);

      // Render Single Lodge Mode
      if (singleLodge) {
        const lodgeCoords = getLodgeCoordinates(singleLodge);

        // Walking distance circle (~350m)
        L.circle([lodgeCoords.lat, lodgeCoords.lng], {
          radius: 350,
          color: '#F45B2A',
          fillColor: '#FFF0E9',
          fillOpacity: 0.25,
          weight: 2,
          dashArray: '4, 4',
        }).addTo(markersLayer);

        const singleLodgeIcon = L.divIcon({
          className: 'custom-lodge-single-marker',
          html: `
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F45B2A] text-white border-2 border-white shadow-xl text-xs font-black whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-105 transition-transform">
              <svg class="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <span>${formatNaira(singleLodge.pricing.min_price)}/yr</span>
            </div>
          `,
          iconSize: [0, 0],
        });

        L.marker([lodgeCoords.lat, lodgeCoords.lng], { icon: singleLodgeIcon }).addTo(markersLayer);

        const bounds = L.latLngBounds([
          [lodgeCoords.lat, lodgeCoords.lng],
          [mapCenter.lat, mapCenter.lng],
        ]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }

      // Render Multi-Lodge Discovery Mode (Map Home)
      if (lodges && lodges.length > 0) {
        lodges.forEach((lodge) => {
          const coords = getLodgeCoordinates(lodge);
          const isSelected = selectedLodgeId === lodge.id;
          const priceShort =
            lodge.pricing.min_price >= 1000000
              ? `₦${(lodge.pricing.min_price / 1000000).toFixed(1)}M`
              : `₦${Math.round(lodge.pricing.min_price / 1000)}k`;

          // Orange pin with white house icon as depicted in Screen 4 of reference UI
          const lodgeIcon = L.divIcon({
            className: `lodge-marker-${lodge.id}`,
            html: `
              <div class="group relative flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 active:scale-95 ${isSelected ? 'scale-115 z-50' : 'hover:scale-110 z-20'
              }">
                <div class="flex h-8 w-8 items-center justify-center rounded-full ${isSelected ? 'bg-[#24272B] ring-4 ring-[#F45B2A]' : 'bg-[#F45B2A]'
              } text-white shadow-lg border-2 border-white">
                  <svg class="h-4 w-4 fill-white" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                </div>
                <div class="mt-1 px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-[#24272B] text-white ring-1 ring-[#F45B2A]' : 'bg-white/95 text-[#24272B] border border-[#E8E8E5]'
              } shadow-xs text-[10px] font-black tracking-tight whitespace-nowrap">
                  ${priceShort}
                </div>
              </div>
            `,
            iconSize: [0, 0],
          });

          const marker = L.marker([coords.lat, coords.lng], { icon: lodgeIcon }).addTo(markersLayer);

          marker.on('click', () => {
            setActiveLodge(lodge);
            if (onSelectLodge) onSelectLodge(lodge);
            map.flyTo([coords.lat, coords.lng], 15, { duration: 0.8 });
          });
        });
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    singleLodge,
    lodges,
    universitySlug,
    activeUniSlug,
    zoom,
    radiusMiles,
    selectedLodgeId,
    mapCenter.lat,
    mapCenter.lng,
    schoolDisplayName,
  ]);

  // Recenter when single target changes
  const targetLodge = singleLodge || activeLodge || lodges?.[0];
  const targetCoords = targetLodge ? getLodgeCoordinates(targetLodge) : mapCenter;

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-[#E8E8E5] shadow-sm bg-[#EBF0EC] ${className}`}
    >
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-0" />

      {/* Floating GPS Action Button (Bottom Right of Map, matching Screen 4) */}
      {showGpsButton && (
        <div className="absolute bottom-4 right-4 z-20">
          <button
            type="button"
            onClick={onGpsClick}
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xl border border-[#E8E8E5] transition-transform active:scale-90 ${isGpsActive ? 'text-[#F45B2A] ring-2 ring-[#F45B2A]' : 'text-[#24272B] hover:text-[#F45B2A]'
              }`}
            aria-label="Center on my location"
            title={isGpsActive ? 'Showing places near your current location' : 'Use your current location'}
          >
            <Crosshair className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Floating Directions Action (Single Lodge Detail View) */}
      {showDirectionsButton && targetLodge && (
        <div className="absolute bottom-3 right-3 z-10 pointer-events-auto">
          <a
            href={getGoogleMapsDirectionsUrl(targetCoords.lat, targetCoords.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#F45B2A] hover:bg-[#DE4C1D] text-white font-bold text-xs px-3.5 py-2 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Open in Google Maps</span>
            <ExternalLink className="h-3 w-3 opacity-75" />
          </a>
        </div>
      )}
    </div>
  );
}
