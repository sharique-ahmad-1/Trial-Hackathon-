import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  let dbStatus = 'ok';
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) dbStatus = 'error: ' + error.message;
  } catch (e) {
    dbStatus = 'unreachable';
  }

  return NextResponse.json({
    status: 'healthy',
    application: 'WellTrack Senior Health & Wellness Tracker',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
}
