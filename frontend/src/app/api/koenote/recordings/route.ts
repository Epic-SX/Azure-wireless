import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_rePr_wireless_API_URL || '';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
  
  try {
    // Forward the request to the actual API
    const response = await fetch(`${API_URL}/koenote/recordings`, {
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
    // Make sure we're returning the data in the expected format
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API proxy:', error);
    
    // For development, return mock data if the API call fails
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: API proxy returning mock data');
      
      const mockData = {
        recordings: [
          {
            id: '1',
            device_id: 'test-device-001',
            location: 'テスト店舗1階',
            timestamp: new Date().toISOString(),
            level: 1,
            audio_url: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg'
          },
          {
            id: '2',
            device_id: 'test-device-002',
            location: 'テスト店舗2階',
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            level: 2,
            audio_url: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
            alert_message: '通常より大きな音が検出されていますが、NGワードの検出はありませんでした。'
          },
          {
            id: '3',
            device_id: 'test-device-003',
            location: 'テスト店舗入口',
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            level: 3,
            audio_url: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg',
            alert_message: '音声解析の結果、以下のようなワードが含まれていた可能性があります:『死ね』\n※言葉の表現は前後の文脈により異なる場合があります。',
            danger_words: ['死ね']
          }
        ]
      };
      
      return NextResponse.json(mockData);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch recordings', recordings: [] },
      { status: 500 }
    );
  }
} 