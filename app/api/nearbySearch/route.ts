import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const keyword = searchParams.get('keyword') || 'roasters';

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000, // search within 5km radius
          keyword,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      }
    );
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching nearby places:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to fetch nearby places' }, { status: 500 });
  }
}
