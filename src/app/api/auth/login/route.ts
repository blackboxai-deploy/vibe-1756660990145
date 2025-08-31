import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';
import { LoginFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formData: LoginFormData = body;

    // Validate required fields
    if (!formData.email || !formData.password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Attempt login
    const authResponse = await authService.login(formData);
    
    return NextResponse.json({
      success: true,
      data: authResponse,
      message: 'Login successful'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 401 });
  }
}