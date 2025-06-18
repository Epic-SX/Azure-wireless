import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_rePr_wireless_API_URL || '';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
  
  try {
    const requestBody = await request.json();
    
    // Forward the request to the actual API
    const response = await fetch(`${API_URL}/koenoto/upload-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(requestBody),
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
      console.log('Development mode: API proxy returning mock upload response');
      
      // Generate a mock S3 key for the uploaded audio
      const mockKey = `uploads/audio-${Date.now()}.webm`;
      
      return NextResponse.json({
        key: mockKey,
        success: true
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to upload audio' },
      { status: 500 }
    );
  }
} 