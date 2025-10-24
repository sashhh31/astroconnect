import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'astroconnect-backend',
    status: 'ok',
    time: new Date().toISOString(),
    version: process.env.npm_package_version || '0.0.1',
  });
}
