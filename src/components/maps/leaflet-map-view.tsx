'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Navigation, MapPin } from 'lucide-react';
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
}: LeafletMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [activeLodge, setActiveLodge] = useState<Lodge | null>(singleLodge || null);

  const activeUniSlug =
    singleLodge?.university_slug ||
    universitySlug ||
    lodges?.[0]?.university_slug ||
    'university-of-lagos';

  const uniLocation = getUniversityCoordinates(activeUniSlug);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      // Dynamically import Leaflet in browser only
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initial center point
      const initialCenter: Coordinates = singleLodge
        ? getLodgeCoordinates(singleLodge)
        : uniLocation;

      const map = L.map(mapContainerRef.current, {
        center: [initialCenter.lat, initialCenter.lng],
        zoom: zoom || (singleLodge ? 16 : 14),
        scrollWheelZoom: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Add Attribution nicely at bottom right
      L.control
        .attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors')
        .addTo(map);

      // CartoDB Voyager Tile Layer (Modern, fast, high contrast street map)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Layer group for markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      // Campus Landmark Marker (Graduation Cap / Campus Gate)
      const campusIcon = L.divIcon({
        className: 'custom-campus-marker',
        html: `
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white border-2 border-amber-400 shadow-lg text-[11px] font-bold whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2">
            <svg class="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
            </svg>
            <span>${uniLocation.campusName}</span>
          </div>
        `,
        iconSize: [0, 0],
      });

      L.marker([uniLocation.lat, uniLocation.lng], { icon: campusIcon })
        .bindTooltip(`<strong>${uniLocation.campusName}</strong><br/>Campus Landmark Centroid`, {
          direction: 'top',
          offset: [0, -12],
        })
        .addTo(markersLayer);

      // Render Single Lodge Mode
      if (singleLodge) {
        const lodgeCoords = getLodgeCoordinates(singleLodge);

        // Walking distance radius circle (~400m)
        L.circle([lodgeCoords.lat, lodgeCoords.lng], {
          radius: 350,
          color: '#2563eb',
          fillColor: '#3b82f6',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '4, 4',
        }).addTo(markersLayer);

        // Single Lodge Pin with price pill
        const singleLodgeIcon = L.divIcon({
          className: 'custom-lodge-single-marker',
          html: `
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white border-2 border-white shadow-xl text-xs font-extrabold whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-105 transition-transform">
              <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <span>${formatNaira(singleLodge.pricing.min_price)}/yr</span>
            </div>
          `,
          iconSize: [0, 0],
        });

        const singleMarker = L.marker([lodgeCoords.lat, lodgeCoords.lng], { icon: singleLodgeIcon }).addTo(markersLayer);

        singleMarker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; min-width: 200px; padding: 4px;">
            <strong style="display: block; font-size: 13px; color: #0f172a; margin-bottom: 2px;">${singleLodge.title}</strong>
            <span style="color: #64748b; font-size: 11px; display: block; margin-bottom: 6px;">${singleLodge.address}</span>
            <div style="font-weight: 700; color: #1e293b; margin-bottom: 8px;">
              ${formatNaira(singleLodge.pricing.min_price)} <span style="font-weight: normal; color: #64748b;">/ year</span>
            </div>
            <a href="${getGoogleMapsDirectionsUrl(lodgeCoords.lat, lodgeCoords.lng)}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; background: #2563eb; color: #fff; padding: 6px 12px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 11px;">
              Open in Google Maps
            </a>
          </div>
        `, { offset: [0, -10] });

        // Fit bounds to enclose both the lodge and the campus gate
        const bounds = L.latLngBounds([
          [lodgeCoords.lat, lodgeCoords.lng],
          [uniLocation.lat, uniLocation.lng],
        ]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }

      // Render Multi-Lodge Mode (Explore Page)
      if (lodges && lodges.length > 0) {
        const boundsPoints: [number, number][] = [[uniLocation.lat, uniLocation.lng]];

        lodges.forEach((lodge) => {
          const coords = getLodgeCoordinates(lodge);
          boundsPoints.push([coords.lat, coords.lng]);

          const isSelected = selectedLodgeId === lodge.id;
          const priceShort = lodge.pricing.min_price >= 1000000
            ? `₦${(lodge.pricing.min_price / 1000000).toFixed(1)}M`
            : `₦${Math.round(lodge.pricing.min_price / 1000)}k`;

          const lodgeIcon = L.divIcon({
            className: `custom-multi-lodge-${lodge.id}`,
            html: `
              <div class="group flex items-center gap-1 px-2.5 py-1 rounded-full ${
                isSelected
                  ? 'bg-slate-900 text-white ring-4 ring-blue-500/50 scale-110'
                  : 'bg-white text-slate-900 hover:bg-blue-600 hover:text-white'
              } border border-slate-300 shadow-md text-[11px] font-extrabold whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer">
                <span>${priceShort}</span>
              </div>
            `,
            iconSize: [0, 0],
          });

          const marker = L.marker([coords.lat, coords.lng], { icon: lodgeIcon }).addTo(markersLayer);

          const popupHtml = `
            <div style="font-family: inherit; font-size: 12px; width: 220px; padding: 2px;">
              <img src="${lodge.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}" alt="${lodge.title}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
              <strong style="display: block; font-size: 13px; color: #0f172a; line-height: 1.3; margin-bottom: 2px;">${lodge.title}</strong>
              <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">${lodge.neighbourhood} • ${lodge.distance_to_campus}</div>
              <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 13px; font-weight: 800; color: #0f172a;">${formatNaira(lodge.pricing.min_price)} <span style="font-size: 10px; font-weight: normal; color: #64748b;">/yr</span></span>
                <span style="font-size: 10px; font-weight: 700; color: #16a34a;">${lodge.available_rooms > 0 ? `${lodge.available_rooms} vacant` : 'Full'}</span>
              </div>
              <div style="display: flex; gap: 6px;">
                <a href="/lodges/${lodge.slug}" style="flex: 1; text-align: center; background: #0f172a; color: #fff; padding: 5px 8px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px;">View Lodge</a>
                <a href="${getGoogleMapsDirectionsUrl(coords.lat, coords.lng)}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; background: #eff6ff; color: #2563eb; padding: 5px 8px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px;" title="Open in Google Maps">Directions</a>
              </div>
            </div>
          `;

          marker.bindPopup(popupHtml, { offset: [0, -10] });

          marker.on('click', () => {
            setActiveLodge(lodge);
            if (onSelectLodge) onSelectLodge(lodge);
          });
        });

        // Fit bounds for all lodges + campus gate
        if (boundsPoints.length > 1) {
          const multiBounds = L.latLngBounds(boundsPoints);
          map.fitBounds(multiBounds, { padding: [40, 40], maxZoom: 15 });
        }
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
  }, [singleLodge, lodges, universitySlug, activeUniSlug, zoom]);

  // Recenter when single target changes
  const targetLodge = singleLodge || activeLodge || lodges?.[0];
  const targetCoords = targetLodge ? getLodgeCoordinates(targetLodge) : uniLocation;

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900 ${className}`}>
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{ height, width: '100%' }}
        className="z-0"
      />

      {/* Floating Header Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-xs border border-slate-200/60 dark:border-slate-800/60 pointer-events-auto">
          <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>{uniLocation.campusName}</span>
        </span>
        {singleLodge && (
          <span className="inline-flex items-center rounded-full bg-slate-900/90 dark:bg-black/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs backdrop-blur-md pointer-events-auto">
            {singleLodge.distance_to_campus}
          </span>
        )}
      </div>

      {/* Floating Bottom Action: Open Native Google Maps Button */}
      {showDirectionsButton && targetLodge && (
        <div className="absolute bottom-3 right-3 z-10 pointer-events-auto">
          <a
            href={getGoogleMapsDirectionsUrl(targetCoords.lat, targetCoords.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
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
