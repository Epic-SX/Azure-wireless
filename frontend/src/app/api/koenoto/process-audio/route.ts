import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_rePr_wireless_API_URL || '';
  
  try {
    const requestBody = await request.json();
    
    // Forward the request to the actual API
    const response = await fetch(`${API_URL}/koenoto/process-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      console.log('Development mode: API proxy returning mock process-audio response');
      
      // Generate a mock execution ARN for Step Functions workflow
      const mockExecutionArn = `arn:aws:states:ap-northeast-1:123456789012:execution:KoenotoProcessingStateMachine:${Date.now()}`;
      
      return NextResponse.json({
        executionArn: mockExecutionArn,
        message: "Processing started"
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
} 