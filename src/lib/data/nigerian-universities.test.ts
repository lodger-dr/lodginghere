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

  it('should have a substantial list of universities across all tiers', () => {
    expect(NIGERIAN_UNIVERSITIES.length).toBeGreaterThan(60);

    const federal = NIGERIAN_UNIVERSITIES.filter((u) => u.university_type === 'federal');
    const state = NIGERIAN_UNIVERSITIES.filter((u) => u.university_type === 'state');
    const privateUnis = NIGERIAN_UNIVERSITIES.filter((u) => u.university_type === 'private');

    expect(federal.length).toBeGreaterThan(20);
    expect(state.length).toBeGreaterThan(15);
    expect(privateUnis.length).toBeGreaterThan(15);
  });

  it('should have unique slugs for all universities', () => {
    const slugs = NIGERIAN_UNIVERSITIES.map((u) => u.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('every university should map to a valid Nigerian state', () => {
    const validStateNames = new Set(NIGERIAN_STATES.map((s) => s.name));
    NIGERIAN_UNIVERSITIES.forEach((u) => {
      expect(validStateNames.has(u.state)).toBe(true);
    });
  });
});
