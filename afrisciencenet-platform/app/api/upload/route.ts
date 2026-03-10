import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Upload endpoint ready. Integrate S3/local adapter based on deployment target.' });
}
