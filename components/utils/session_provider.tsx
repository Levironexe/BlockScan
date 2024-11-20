'use client';

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add console.log to debug
    console.log('Current sessionId:', localStorage.getItem('sessionId'));
    
    if (typeof window !== 'undefined' && !localStorage.getItem('sessionId')) {
      const newSessionId = uuidv4();
      localStorage.setItem('sessionId', newSessionId);
      console.log('Created new sessionId:', newSessionId);
    }
  }, []);

  return <>{children}</>;
}