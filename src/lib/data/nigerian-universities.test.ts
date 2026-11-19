import { describe, it, expect } from 'vitest';
import { NIGERIAN_UNIVERSITIES } from './nigerian-universities';
import { NIGERIAN_STATES } from './nigerian-states';

describe('Nigerian Universities & States Dataset', () => {
  it('should include 36 states and Federal Capital Territory', () => {
    expect(NIGERIAN_STATES.length).toBe(37);
    const names = NIGERIAN_STATES.map((s) => s.name);
    expect(names).toContain('Lagos');
    expect(names).toContain('Federal Capital Territory');
    expect(names).toContain('Kano');
    expect(names).toContain('Rivers');
  });

  it('should have all 328 approved universities in Nigeria across federal, state, and private tiers', () => {
    expect(NIGERIAN_UNIVERSITIES.length).toBe(328);

    const federal = NIGERIAN_UNIVERSITIES.filter((u) => u.university_type === 'federal');
    const state = NIGERIAN_UNIVERSITIES.filter((u) => u.university_type === 'state');
    const privateUnis = NIGERIAN_UNIVERSITIES.filter((u) => u.university_type === 'private');

    expect(federal.length).toBe(77);
    expect(state.length).toBe(69);
    expect(privateUnis.length).toBe(182);
  });

  it('should have unique slugs for all universities', () => {
    const slugs = NIGERIAN_UNIVERSITIES.map((u) => u.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('every university should map to a valid Nigerian state and have required fields', () => {
    const validStateNames = new Set(NIGERIAN_STATES.map((s) => s.name));
    NIGERIAN_UNIVERSITIES.forEach((u) => {
      expect(validStateNames.has(u.state)).toBe(true);
      expect(u.name.trim().length).toBeGreaterThan(0);
      expect(u.slug.trim().length).toBeGreaterThan(0);
      expect(u.acronym.trim().length).toBeGreaterThan(0);
      expect(u.city.trim().length).toBeGreaterThan(0);
      expect(['federal', 'state', 'private']).toContain(u.university_type);
    });
  });

  it('should cover all geopolitical regions and states across Nigeria', () => {
    const statesRepresented = new Set(NIGERIAN_UNIVERSITIES.map((u) => u.state));
    // Verify comprehensive distribution
    expect(statesRepresented.size).toBe(37);
  });
});
