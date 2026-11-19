import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ z: string; x: string; y: string }> }
) {
  const { z, x, y } = await params;
  const tomtomApiKey =
    process.env.TOM_TOM_API_KEY ||
    process.env.NEXT_PUBLIC_TOMTOM_API_KEY ||
    process.env.NEXT_PUBLIC_TOM_TOM_API_KEY ||
    '';

  // 1. Fetch from TomTom Orbis Display Raster API
  if (tomtomApiKey) {
    try {
      const url = `https://api.tomtom.com/maps/orbis/display/raster/tile/${z}/${x}/${y}?apiVersion=2&tileSize=512&key=${tomtomApiKey}`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const buffer = await res.arrayBuffer();
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': res.headers.get('content-type') || 'image/png',
            'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch {
      // Fall through to OpenStreetMap
    }
  }

  // 2. Fallback to OpenStreetMap (free, never watermarked)
  try {
    const osmRes = await fetch(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`, {
      headers: {
        'User-Agent': 'LodgeHere-StudentAccommodation/1.0',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (osmRes.ok) {
      const buffer = await osmRes.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch {
    // Return empty 404
  }

  return new NextResponse(null, { status: 404 });
}
