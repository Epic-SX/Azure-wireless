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
    const response = await fetch(`${API_URL}/koenoto/${recordingId}`, {
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
      console.log('Development mode: API proxy returning mock recording data');
      
      // Generate mock data based on the ID
      const mockData = {
        id: recordingId,
        title: `録音 ${recordingId}`,
        date: new Date().toISOString().split('T')[0],
        start_time: new Date().toTimeString().split(' ')[0],
        duration: "00:03:45",
        transcript: "これはサンプルの文字起こしです。録音内容のテキスト表示がここに表示されます。",
        summary: "これは録音内容の要約サンプルです。重要なポイントや主要なトピックがここに表示されます。",
        keywords: ["サンプル", "テスト", "録音"],
        user_id: "demo-user-123",
        audioUrl: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
      };
      
      return NextResponse.json(mockData);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch recording details' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const recordingId = params.id;
  const API_URL = process.env.NEXT_PUBLIC_rePr_wireless_API_URL || '';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
  
  try {
    // Forward the delete request to the actual API
    const response = await fetch(`${API_URL}/koenoto/${recordingId}`, {
      method: 'DELETE',
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
    
    // For development, return mock success response
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: API proxy returning mock delete response');
      
      return NextResponse.json({
        success: true,
        message: `Recording ${recordingId} deleted successfully`
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to delete recording' },
      { status: 500 }
    );
  }
} 