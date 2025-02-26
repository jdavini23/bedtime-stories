import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Missing name parameter' }, { status: 400 });
  }

  // Sanitize the name parameter to prevent directory traversal
  const sanitizedName = name.replace(/\.\./g, '').replace(/[^a-zA-Z0-9-_.]/g, '');

  // Construct the path to the SVG file
  const svgPath = path.join(
    process.cwd(),
    'public',
    'images',
    'illustrations',
    `${sanitizedName}.svg`
  );

  try {
    // Check if the file exists
    if (!fs.existsSync(svgPath)) {
      return NextResponse.json({ error: 'SVG file not found' }, { status: 404 });
    }

    // Read the SVG file
    const svgContent = fs.readFileSync(svgPath, 'utf-8');

    // Return the SVG content with appropriate headers
    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving SVG:', error);
    return NextResponse.json({ error: 'Failed to serve SVG' }, { status: 500 });
  }
}
