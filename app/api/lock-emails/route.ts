import { NextRequest, NextResponse } from 'next/server';
import { recordLockEmail } from '@/lib/lock-email-log';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: unknown };
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    await recordLockEmail(email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to capture lock page email:', error);
    return NextResponse.json(
      { error: 'Unable to save your email right now' },
      { status: 500 }
    );
  }
}
