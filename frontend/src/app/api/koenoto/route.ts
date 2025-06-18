import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_rePr_wireless_API_URL || '';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
  
  // Get the user_id from query parameters
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('user_id') || 'default';
  
  try {
    // Forward the request to the actual API
    const response = await fetch(`${API_URL}/koenoto?user_id=${userId}`, {
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
      console.log('Development mode: API proxy returning mock recordings data');
      
      // Generate mock recordings data
      const mockData = [
        {
          id: '1',
          title: '録音 1',
          date: new Date().toISOString().split('T')[0],
          start_time: new Date().toTimeString().split(' ')[0],
          duration: "00:03:45",
          transcript: "これはサンプルの文字起こしです。",
          summary: "これは録音内容の要約サンプルです。",
          keywords: ["サンプル", "テスト"],
          user_id: userId,
          audioUrl: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
        },
        {
          id: '2',
          title: '録音 2',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
          start_time: new Date(Date.now() - 86400000).toTimeString().split(' ')[0],
          duration: "00:02:15",
          transcript: "これは別のサンプルの文字起こしです。",
          summary: "これは別の録音内容の要約サンプルです。",
          keywords: ["別", "サンプル"],
          user_id: userId,
          audioUrl: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
        }
      ];
      
      return NextResponse.json(mockData);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch recordings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_rePr_wireless_API_URL || '';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
  
  try {
    const requestBody = await request.json();
    
    // Forward the request to the actual API
    const response = await fetch(`${API_URL}/koenoto`, {
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
      console.log('Development mode: API proxy returning mock POST response');
      
      // Generate mock response with the submitted data
      try {
        const requestBody = await request.json();
        const mockItem = {
          ...requestBody,
          id: `mock-${Date.now()}`,
        };
        
        return NextResponse.json({ 
          success: true,
          item: mockItem
        });
      } catch (e) {
        return NextResponse.json({ 
          success: true,
          item: {
            id: `mock-${Date.now()}`,
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
      { error: 'Failed to create recording' },
      { status: 500 }
    );
  }
} 