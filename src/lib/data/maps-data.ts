// Geospatial coordinates & navigation utilities for Nigerian University Campuses & Lodges

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UniversityLocation extends Coordinates {
  campusName: string;
}

// Major Nigerian University Campus Coordinates (Gate & Landmark centroids)
export const UNIVERSITY_COORDINATES: Record<string, UniversityLocation> = {
  'university-of-lagos': { lat: 6.5158, lng: 3.3898, campusName: 'UNILAG Akoka Gate' },
  'university-of-ibadan': { lat: 7.4443, lng: 3.9003, campusName: 'UI Main Gate (Agbowo)' },
  'obafemi-awolowo-university': { lat: 7.5186, lng: 4.5284, campusName: 'OAU Road 1 Main Gate' },
  'university-of-benin': { lat: 6.3995, lng: 5.6145, campusName: 'UNIBEN Ugbowo Main Gate' },
  'federal-university-of-technology-akure': { lat: 7.3034, lng: 5.1378, campusName: 'FUTA South Gate' },
  'university-of-nigeria-nsukka': { lat: 6.8667, lng: 7.4117, campusName: 'UNN Nsukka Main Gate' },
  'university-of-nigeria': { lat: 6.8667, lng: 7.4117, campusName: 'UNN Nsukka Main Gate' },
  'ahmadu-bello-university': { lat: 11.1524, lng: 7.6477, campusName: 'ABU Samaru Main Gate' },
  'covenant-university': { lat: 6.6717, lng: 3.1581, campusName: 'Covenant Canaanland Gate' },
  'babcock-university': { lat: 6.8928, lng: 3.7229, campusName: 'Babcock Ilishan Gate' },
  'lagos-state-university': { lat: 6.4674, lng: 3.2014, campusName: 'LASU Ojo Main Gate' },
  'federal-university-of-technology-minna': { lat: 9.5836, lng: 6.5463, campusName: 'FUTMINNA Gidan Kwanu' },
  'bayero-university-kano': { lat: 11.9792, lng: 8.4844, campusName: 'BUK New Campus Gate' },
  'university-of-ilorin': { lat: 8.4799, lng: 4.6715, campusName: 'UNILORIN Permanent Site Gate' },
  'university-of-jos': { lat: 9.9535, lng: 8.8885, campusName: 'UNIJOS Naraguta Campus Gate' },
  'university-of-port-harcourt': { lat: 4.9036, lng: 6.9197, campusName: 'UNIPORT Choba Gate' },
  'nnamdi-azikiwe-university': { lat: 6.2519, lng: 7.1172, campusName: 'UNIZIK Awka Main Gate' },
  'federal-university-of-agriculture-abeokuta': { lat: 7.2281, lng: 3.4443, campusName: 'FUNAAB Alabata Gate' },
};

export const DEFAULT_NIGERIA_CENTER: Coordinates = {
  lat: 9.0820,
  lng: 8.6753,
};

// Retrieve known campus coordinate or fallback to Lagos
export function getUniversityCoordinates(slug?: string): UniversityLocation {
  if (slug && UNIVERSITY_COORDINATES[slug]) {
    return UNIVERSITY_COORDINATES[slug];
  }
  return { lat: 6.5158, lng: 3.3898, campusName: 'Campus Center' };
}

// Generate consistent hash-based offset so lodges without manual GPS coordinates
// appear gracefully near their designated university campus without clumping exactly on top
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function getLodgeCoordinates(lodge: {
  id: string;
  slug?: string;
  latitude?: number | null;
  longitude?: number | null;
  university_slug?: string;
}): Coordinates {
  if (
    typeof lodge.latitude === 'number' &&
    typeof lodge.longitude === 'number' &&
    !isNaN(lodge.latitude) &&
    !isNaN(lodge.longitude) &&
    lodge.latitude !== 0 &&
    lodge.longitude !== 0
  ) {
    return { lat: lodge.latitude, lng: lodge.longitude };
  }

  const uni = getUniversityCoordinates(lodge.university_slug);
  const seed = Math.abs(hashString(lodge.id || lodge.slug || 'lodge'));
  // Subtle offset within ~250m - 800m of campus gate
  const latOffset = ((seed % 100) - 50) * 0.00012;
  const lngOffset = (((seed >> 3) % 100) - 50) * 0.00012;

  return {
    lat: Number((uni.lat + latOffset).toFixed(6)),
    lng: Number((uni.lng + lngOffset).toFixed(6)),
  };
}

// Open native Google Maps turn-by-turn navigation URL directly on mobile / desktop
export function getGoogleMapsDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}

// Search location query on Google Maps
export function getGoogleMapsSearchUrl(address: string, universityName?: string): string {
  const query = universityName ? `${address}, near ${universityName}` : address;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
