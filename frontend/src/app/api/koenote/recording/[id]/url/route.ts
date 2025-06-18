import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const recordingId = params.id;
  const API_URL = process.env.NEXT_PUBLIC_rePr_wireless_API_URL || '';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
  
  try {
    // Forward the request to the actual API
    const response = await fetch(`${API_URL}/koenote/recording/${recordingId}/url`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the response from our Next.js API route
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API proxy:', error);
    
    // For development, return mock data if the API call fails
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: API proxy returning mock signed URL');
      
      // Use different mock audio URLs based on the recording ID
      let mockAudioUrl = 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg';
      
      if (recordingId === '2') {
        mockAudioUrl = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
      } else if (recordingId === '3') {
        mockAudioUrl = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';
      }
      
      return NextResponse.json({
        signedUrl: mockAudioUrl
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch audio URL' },
      { status: 500 }
    );
  }
} 