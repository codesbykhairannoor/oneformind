import { useSessionContext } from '@/components/SessionProvider';

export function useSupabaseSession() {
  const { session, status } = useSessionContext();
  return { data: session, status };
}
