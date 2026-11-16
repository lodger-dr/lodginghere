import { describe, it, expect } from 'vitest';
import {
  getUniversityCoordinates,
  getLodgeCoordinates,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsSearchUrl,
  UNIVERSITY_COORDINATES,
} from './maps-data';

describe('maps-data utilities', () => {
  it('returns valid coordinates for known Nigerian universities', () => {
    const unilag = getUniversityCoordinates('university-of-lagos');
    expect(unilag.lat).toBeCloseTo(6.5158, 2);
    expect(unilag.lng).toBeCloseTo(3.3898, 2);
    expect(unilag.campusName).toContain('UNILAG');

    const ui = getUniversityCoordinates('university-of-ibadan');
    expect(ui.lat).toBeCloseTo(7.4443, 2);
    expect(ui.lng).toBeCloseTo(3.9003, 2);
  });

  it('falls back to default coordinates when university slug is unknown or omitted', () => {
    const unknown = getUniversityCoordinates('non-existent-uni');
    expect(unknown.lat).toBeDefined();
    expect(unknown.lng).toBeDefined();
  });

  it('uses explicit lodge coordinates when provided', () => {
    const coords = getLodgeCoordinates({
      id: 'custom-lodge-1',
      latitude: 6.5200,
      longitude: 3.3900,
      university_slug: 'university-of-lagos',
    });
    expect(coords.lat).toBe(6.5200);
    expect(coords.lng).toBe(3.3900);
  });

  it('computes deterministic nearby coordinates when latitude/longitude are omitted', () => {
    const coords1 = getLodgeCoordinates({
      id: 'lodge-abc-123',
      university_slug: 'university-of-lagos',
    });
    const coords2 = getLodgeCoordinates({
      id: 'lodge-abc-123',
      university_slug: 'university-of-lagos',
    });
    expect(coords1).toEqual(coords2);
    expect(coords1.lat).toBeCloseTo(6.5158, 1);
    expect(coords1.lng).toBeCloseTo(3.3898, 1);
  });

  it('generates correct Google Maps directions URL', () => {
    const url = getGoogleMapsDirectionsUrl(6.5182, 3.3855);
    expect(url).toBe('https://www.google.com/maps/dir/?api=1&destination=6.5182,3.3855&travelmode=walking');
  });

  it('generates correct Google Maps search URL', () => {
    const url = getGoogleMapsSearchUrl('14 University Road, Akoka', 'UNILAG');
    expect(url).toContain('https://www.google.com/maps/search/?api=1&query=');
    expect(url).toContain('14%20University%20Road');
  });
});
