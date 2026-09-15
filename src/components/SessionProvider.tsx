'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';

interface SessionContextType {
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  status: 'loading',
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const { data: { session: baseSession } } = await supabase.auth.getSession();
        
        if (!baseSession) {
          if (mounted) {
            setSession(null);
            setStatus('unauthenticated');
          }
          return;
        }

        // Fetch profile
        const res = await fetch('/api/user');
        if (res.ok) {
           const profile = await res.json();
           (baseSession.user as any).isPremium = profile.isPremium;
           (baseSession.user as any).planType = profile.planType;
           (baseSession.user as any).premiumUntil = profile.premiumUntil;
           (baseSession.user as any).trialStartedAt = profile.trialStartedAt || profile.createdAt || baseSession.user.created_at;
           (baseSession.user as any).trialEndsAt = profile.trialEndsAt;
           (baseSession.user as any).hasUsedTrial = profile.hasUsedTrial;
        }
        
        if (mounted) {
          setSession(baseSession);
          setStatus('authenticated');
        }
      } catch (e) {
        console.error("Error fetching session/profile", e);
        if (mounted) {
          setSession(null);
          setStatus('unauthenticated');
        }
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      if (!newSession) {
        setSession(null);
        setStatus('unauthenticated');
        return;
      }
      
      setStatus('loading');
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
           const profile = await res.json();
           (newSession.user as any).isPremium = profile.isPremium;
           (newSession.user as any).planType = profile.planType;
           (newSession.user as any).premiumUntil = profile.premiumUntil;
           (newSession.user as any).trialStartedAt = profile.trialStartedAt || profile.createdAt || newSession.user.created_at;
           (newSession.user as any).trialEndsAt = profile.trialEndsAt;
           (newSession.user as any).hasUsedTrial = profile.hasUsedTrial;
        }
      } catch (e) {
        console.error("Error fetching profile on auth change", e);
      }
      if (mounted) {
        setSession(newSession);
        setStatus('authenticated');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SessionContext.Provider value={{ session, status }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
