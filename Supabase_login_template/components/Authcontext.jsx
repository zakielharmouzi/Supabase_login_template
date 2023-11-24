import React, { useEffect, useState, useContext } from "react";
import supabase from "../utils/Supabase";

export const Authcontext = React.createContext({
  user: null,
  email_2: null,
  session: null,
  supabase: null,
  signIn: () => {},
  signOut: () => {},
  resetPassword: () => {},
  sendOtpEmail: () => {},
  setEmail2: () => {},
});

export function useAuth() {
  return React.useContext(Authcontext);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [email_2, setEmail_2] = useState(null);

const signIn = async (email, password) => {
  console.log("Signing in");
  const {error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error){
    alert(error.message);
  }
  console.log("Sign-in successful");
  
};

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log("Sign-out successful");
    } catch (error) {
      console.error("Sign-out failed", error);
      throw error; 
    }
  };

  const sendOtpEmail = async (email) => {
    console.log("reseting");
    const {error} = await supabase.auth.resetPasswordForEmail(email);   if (error){
      alert(error.message);
    }
    console.log("Reseting successful");

  };
  
  const setEmail2 = async (email) => {
    console.log("setting email");
    setEmail_2(email);
    console.log("email", email);
  };

  const resetPassword = async ( OTptok) => {
    console.log("resetting");
    console.log("session", OTptok);
    console.log("mail waaa MIIII", email_2);
    const { data, error } = await supabase.auth.verifyOtp({ email:email_2, token:OTptok, type: 'recovery'})
    if (error){
      alert(error.message);
    }
    console.log("aaaa",data);
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
    resetPassword,
    sendOtpEmail,
    setEmail2,
  };





  return <Authcontext.Provider value={value}>{children}</Authcontext.Provider>;
}
