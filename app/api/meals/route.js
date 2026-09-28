import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', 'senior_user_1')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('meals')
      .insert([{
        user_id: body.user_id || 'senior_user_1',
        meal_type: body.meal_type || 'Breakfast',
        food_name: body.food_name,
        calories: parseInt(body.calories) || 0,
        protein_grams: parseFloat(body.protein_grams) || 0,
        carbs_grams: parseFloat(body.carbs_grams) || 0,
        fat_grams: parseFloat(body.fat_grams) || 0,
        fiber_grams: parseFloat(body.fiber_grams) || 0,
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
