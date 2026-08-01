import { NextRequest, NextResponse } from 'next/server';
import { recordLockContact } from '@/lib/lock-email-log';
import { supabase } from '@/lib/supabase';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\-\s\d.]{7,25}$/;

async function saveNewsletterContact({
  email,
  phone,
  req,
}: {
  email: string;
  phone: string;
  req: NextRequest;
}) {
  const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || '';
  const referer = req.headers.get('referer') || '';
  const preferences = {
    email_notifications: Boolean(email),
    sms_notifications: Boolean(phone),
  };

  let existingSubscriber = null;
  let checkError = null;

  if (email) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single();
    existingSubscriber = data;
    checkError = error;
  } else if (phone) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('phone', phone)
      .single();
    existingSubscriber = data;
    checkError = error;
  }

  if (checkError && checkError.code !== 'PGRST116') {
    throw checkError;
  }

  if (existingSubscriber) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        ...(email && { email }),
        ...(phone && { phone }),
        status: 'active',
        preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSubscriber.id);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({
      ...(email && { email }),
      ...(phone && { phone }),
      ip_address: clientIP,
      user_agent: userAgent,
      referrer_url: referer,
      status: 'active',
      source: 'lock_page',
      confirmed_at: new Date().toISOString(),
      preferences,
    });

  if (error) {
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: unknown; phone?: unknown };
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Enter an email address or phone number' },
        { status: 400 }
      );
    }

    if (email && !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    if (phone && !PHONE_PATTERN.test(phone)) {
      return NextResponse.json({ error: 'Enter a valid phone number' }, { status: 400 });
    }

    await saveNewsletterContact({ email, phone, req });

    try {
      await recordLockContact({ email, phone });
    } catch (logError) {
      console.error('Failed to append lock page contact log:', logError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to capture lock page contact:', error);
    return NextResponse.json(
      { error: 'Unable to save your info right now' },
      { status: 500 }
    );
  }
}
