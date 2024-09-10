import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 여기에 이미지 업로드 로직을 구현하세요
  return NextResponse.json({ message: 'Image uploaded successfully' });
}

export async function GET() {
  return NextResponse.json({ message: 'GET request received' });
}
