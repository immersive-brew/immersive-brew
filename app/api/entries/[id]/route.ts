import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Named export for PUT request (Update)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { temperature, coffee_weight, water_weight, grind_setting, overall_time } = await request.json();

  console.log('Received data for update:', { temperature, coffee_weight, water_weight, grind_setting, overall_time });

  if (!id) {
    return NextResponse.json({ message: 'Missing entry ID for update' }, { status: 400 });
  }

  // Update the entry in the 'entries' table
  const { data, error } = await supabase
    .from('entries')
    .update({
      temperature,
      coffee_weight,
      water_weight,
      grind_setting,
      overall_time,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating entry:', error);
    return NextResponse.json({ message: 'Error updating entry', error }, { status: 500 });
  }

  console.log('Entry updated successfully:', data);

  return NextResponse.json({ message: 'Entry updated successfully', data });
}

// Named export for DELETE request (Delete)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Missing entry ID for deletion' }, { status: 400 });
  }

  // Delete the entry from the 'entries' table
  const { data, error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json({ message: 'Error deleting entry', error }, { status: 500 });
  }

  console.log('Entry deleted successfully:', data);

  return NextResponse.json({ message: 'Entry deleted successfully' });
}
