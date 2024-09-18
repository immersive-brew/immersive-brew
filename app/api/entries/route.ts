import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Named export for POST method
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { temperature, coffee_weight, water_weight, grind_setting, overall_time } = body;

    // Insert the data into Supabase
    const { data, error } = await supabase.from('entries').insert([
      {
        temperature,
        coffee_weight,
        water_weight,
        grind_setting,
        overall_time,
      },
    ]);

    if (error) {
      console.error('Error inserting entry into Supabase:', error);
      return NextResponse.json({ message: 'Error inserting entry. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Entry successfully added!', data }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
