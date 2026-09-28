import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', 'senior_user_1')
    .order('schedule_time', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('medications')
      .insert([{
        user_id: body.user_id || 'senior_user_1',
        name: body.name,
        dosage: body.dosage,
        schedule_time: body.schedule_time,
        meal_relation: body.meal_relation || 'After Food',
        color_tag: body.color_tag || 'blue',
        status: 'pending',
        notes: body.notes || ''
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
