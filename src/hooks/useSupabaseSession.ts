import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';

export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async (baseSession: Session | null) => {
      if (!baseSession) {
        setSession(null);
        setIsLoading(false);
        return;
      }
      
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
           const profile = await res.json();
           // Attach custom fields for NextAuth legacy compatibility & subscription/trial state
           (baseSession.user as any).isPremium = profile.isPremium;
           (baseSession.user as any).planType = profile.planType;
           (baseSession.user as any).premiumUntil = profile.premiumUntil;
           (baseSession.user as any).trialStartedAt = profile.trialStartedAt || profile.createdAt || baseSession.user.created_at;
           (baseSession.user as any).trialEndsAt = profile.trialEndsAt;
           (baseSession.user as any).hasUsedTrial = profile.hasUsedTrial;
        }
      } catch (e) {
        console.error("Error fetching user profile", e);
      }
      
      setSession(baseSession);
      setIsLoading(false);
    };

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await fetchProfile(session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setIsLoading(true);
      await fetchProfile(newSession);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return { data: session, status: isLoading ? 'loading' : (session ? 'authenticated' : 'unauthenticated') };
}
