import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_rePr_wireless_API_URL || '';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
  
  try {
    const requestBody = await request.json();
    
    // Forward the request to the actual API
    const response = await fetch(`${API_URL}/koenoto/save-recording`, {
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
      console.log('Development mode: API proxy returning mock save-recording response');
      
      // Get the recording data from the request body
      try {
        const { recording } = await request.json();
        
        // Return the same recording with a success flag
        return NextResponse.json({
          success: true,
          recording: {
            ...recording,
            id: recording.id || `recording-${Date.now()}`
          }
        });
      } catch (e) {
        return NextResponse.json({
          success: true,
          recording: {
            id: `recording-${Date.now()}`,
            title: 'Mock Recording',
            date: new Date().toISOString().split('T')[0],
            start_time: new Date().toTimeString().split(' ')[0],
            duration: "00:01:30",
            transcript: "Mock transcript",
            summary: "Mock summary",
            keywords: ["mock", "test"],
            user_id: "demo-user-123"
          }
        });
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to save recording' },
      { status: 500 }
    );
  }
}