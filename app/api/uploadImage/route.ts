import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const { imageData, userId } = await request.json();

    // Add logging inside the POST request handler
    console.log('Received Image data:', !!imageData); // Log whether imageData exists
    console.log('Received User ID:', userId);

    if (!imageData || !userId) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const fileName = `${userId}-${Date.now()}.png`;
    console.log('Uploading to Supabase with file name:', fileName);

    const { data, error } = await supabase.storage
      .from('generated-images')
      .upload(`images/${fileName}`, Buffer.from(imageData, 'base64'), {
        contentType: 'image/png',
      });

    // Add logging for the Supabase response
    console.log('Supabase upload response:', data, error);

    if (error) {
      console.error('Error during Supabase upload:', error);
      return NextResponse.json({ error: 'Error during upload' }, { status: 500 });
    }

    // Generate a public URL for the uploaded image
    const { publicURL, error: urlError } = supabase.storage
      .from('generated-images')
      .getPublicUrl(`images/${fileName}`);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return NextResponse.json({ error: 'Error generating public URL' }, { status: 500 });
    }

    console.log('Generated public URL:', publicURL);
    return NextResponse.json({ url: publicURL });
  } catch (error) {
    console.error('Error in the POST handler:', error);
    return NextResponse.json({ error: 'Server error during image upload' }, { status: 500 });
  }
}
