import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';
import { RegisterFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formData: RegisterFormData = body;

    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'Name, email, password, and password confirmation are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json({
        success: false,
        error: 'Please enter a valid email address'
      }, { status: 400 });
    }

    // Validate password strength
    if (formData.password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'Passwords do not match'
      }, { status: 400 });
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      return NextResponse.json({
        success: false,
        error: 'You must agree to the terms and conditions'
      }, { status: 400 });
    }

    // Attempt registration
    const authResponse = await authService.register(formData);
    
    return NextResponse.json({
      success: true,
      data: authResponse,
      message: 'Registration successful! Welcome to Lost & Found.'
    }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 400 });
  }
}