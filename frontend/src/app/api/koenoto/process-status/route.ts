import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_rePr_wireless_API_URL || '';
  
  // Get the executionArn from query parameters
  const searchParams = request.nextUrl.searchParams;
  const executionArn = searchParams.get('executionArn');
  
  if (!executionArn) {
    return NextResponse.json(
      { error: 'executionArn parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // Forward the request to the actual API
    const response = await fetch(`${API_URL}/koenoto/process-status?executionArn=${executionArn}`, {
      headers: {
        'Content-Type': 'application/json',
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
      console.log('Development mode: API proxy returning mock process-status response');
      
      // Generate random status for development testing
      const statuses = ['running', 'completed'];
      const randomStatus = Math.random() > 0.3 ? 'completed' : 'running';
      
      if (randomStatus === 'completed') {
        return NextResponse.json({
          status: 'completed',
          result: {
            result: JSON.stringify({
              title: "サンプル録音",
              transcript: "これはサンプルの文字起こしです。録音内容のテキスト表示がここに表示されます。長い文章の場合は自動的にスクロールします。",
              summary: "これは録音内容の要約サンプルです。重要なポイントや主要なトピックがここに表示されます。",
              keywords: ["サンプル", "テスト", "録音", "文字起こし"],
              audioUrl: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
            })
          }
        });
      } else {
        return NextResponse.json({
          status: 'running',
          message: "音声処理中...",
          percentComplete: Math.floor(Math.random() * 100)
        });
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch processing status' },
      { status: 500 }
    );
  }
} 