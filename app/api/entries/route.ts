import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { temperature, coffee_weight, water_weight, grind_setting, overall_time } = body;

    // Add a new entry to the Supabase `entries` table
    const { data, error } = await supabase
      .from('entries')
      .insert([{ temperature, coffee_weight, water_weight, grind_setting, overall_time }]);

    if (error) {
      console.error('Error inserting entry:', error);
      return NextResponse.json({ message: 'Error inserting entry', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Entry created successfully', data });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ message: 'Error handling POST request', error }, { status: 500 });
  }
}
