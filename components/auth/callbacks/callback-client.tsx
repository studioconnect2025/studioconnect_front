"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/AuthStore';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      try {
        handleGoogleCallback(token);
        router.push('/'); // O donde quieras redirigir después del login
      } catch (error) {
        console.error('Error handling Google callback:', error);
        router.push('/login?error=google_callback_error');
      }
    } else {
      router.push('/login?error=no_token');
    }
  }, [searchParams, handleGoogleCallback, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Procesando login con Google...</p>
      </div>
    </div>
  );
}