import { describe, it, expect } from 'vitest';
import manifest from './manifest';

describe('Web App Manifest (PWA Configuration)', () => {
  it('should generate valid manifest conforming to PWA standards and brand palette', () => {
    const config = manifest();

    expect(config).toBeDefined();
    expect(config.name).toBe('LodgeHere');
    expect(config.short_name).toBe('LodgeHere');
    expect(config.start_url).toBe('/');
    expect(config.display).toBe('standalone');
    expect(config.orientation).toBe('portrait');
    expect(config.background_color).toBe('#F8F8F6');
    expect(config.theme_color).toBe('#F45B2A');

    // Verify icons array contains required PWA icons
    expect(config.icons).toBeDefined();
    expect(config.icons?.length).toBeGreaterThanOrEqual(3);

    const icon192 = config.icons?.find((i) => i.sizes === '192x192');
    expect(icon192).toBeDefined();
    expect(icon192?.purpose).toBe('maskable');

    const icon512 = config.icons?.find((i) => i.sizes === '512x512');
    expect(icon512).toBeDefined();
    expect(icon512?.purpose).toBe('any');

    const appleIcon = config.icons?.find((i) => i.sizes === '180x180');
    expect(appleIcon).toBeDefined();
  });
});
