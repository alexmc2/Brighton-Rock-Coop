// 'use client'

// import { createContext, useContext, useEffect, useState } from 'react'
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// import { useRouter } from 'next/navigation'
// import type { User } from '@supabase/auth-helpers-nextjs'
// import type { Database } from '@/types/members/database'

// type AuthContextType = {
//   user: User | null
//   isLoading: boolean
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   isLoading: true,
// })

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()
//   const supabase = createClientComponentClient<Database>()

//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser()
//         setUser(user)
//       } catch (error) {
//         console.error('Error getting user:', error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     getUser()

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null)
//       router.refresh()
//     })

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [supabase, router])

//   return (
//     <AuthContext.Provider value={{ user, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// } 


'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/members/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
    redirectTo?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const value = {
    user,
    loading,
    signIn: async (
      email: string,
      password: string,
      redirectTo: string = '/'
    ) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (!data.session) throw new Error('No session returned');

        setUser(data.session.user);
        console.log('Setting user and redirecting to:', redirectTo);

        // Force a router refresh before navigation
        router.refresh();

        // Use setTimeout to ensure state updates have propagated
        setTimeout(() => {
          router.push(redirectTo);
        }, 100);
      } catch (error) {
        console.error('Sign in error:', error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        router.refresh();
        router.push('/members/login');
      } catch (error) {
        console.error('Sign out error:', error);
        throw error;
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 