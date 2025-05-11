'use client';

import { createBrowserClient } from '@supabase/ssr';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const SupabaseContext = createContext<ReturnType<typeof createBrowserClient> | undefined>(undefined);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export default function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabaseClient, setSupabaseClient] = useState<ReturnType<typeof createBrowserClient> | null>(null);

  useEffect(() => {
    const client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    setSupabaseClient(client);
  }, []);

  if (!supabaseClient) {
    // SupabaseClientが初期化されるまで何も表示しない、もしくはローディング表示
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>;
  }

  return (
    <SupabaseContext.Provider value={supabaseClient}>
      {children}
    </SupabaseContext.Provider>
  );
} 