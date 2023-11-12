import React, { useEffect, useState, useContext } from "react";
import supabase from "../utils/Supabase";

export const Authcontext = React.createContext({
  user: null,
  session: null,
  supabase: null,
  signIn: () => {},
  signOut: () => {},
});

export function useAuth() {
  return React.useContext(Authcontext);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); 

const signIn = async (email, password) => {
  console.log("Signing in");
  const {error: authError} = await supabase.auth.signInWithPassword({
    email,
    password,
  });
   if (authError) {
      setError(authError.message); // Set the error message in the context
    } else {
      console.log("Sign-in successful");
      setError(null); // Clear the error message
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log("Sign-out successful");
    } catch (error) {
      console.error("Sign-out failed", error);
      throw error; // Rethrow the error for higher-level error handling if needed.
    }
  };

  useEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    supabase,
    signIn,
    signOut,
    error,
  };

  return <Authcontext.Provider value={value}>{children}</Authcontext.Provider>;
}
