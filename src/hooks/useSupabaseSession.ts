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
        const { data: profile } = await supabase
          .from('users')
          .select('is_premium, plan_type')
          .eq('email', baseSession.user.email)
          .single();
          
        if (profile) {
           // Attach custom fields for NextAuth legacy compatibility
           (baseSession.user as any).isPremium = profile.is_premium;
           (baseSession.user as any).planType = profile.plan_type;
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
