"use client";

import { ConfirmationResult, GoogleAuthProvider, RecaptchaVerifier, User, onAuthStateChanged, signInWithPhoneNumber, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { establishPlatformSession, logoutPlatformSession } from "../lib/api";
import { firebaseAuth } from "../lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  platformSessionEstablished: boolean;
  phoneOtpPending: boolean;
  signInWithGoogle: () => Promise<void>;
  sendPhoneOtp: (phoneNumber: string, recaptchaContainer: HTMLElement) => Promise<void>;
  verifyPhoneOtp: (code: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platformSessionEstablished, setPlatformSessionEstablished] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const exchangeInFlight = useRef<Promise<void> | null>(null);
  const recaptcha = useRef<RecaptchaVerifier | null>(null);

  const establishSession = useCallback(async (nextUser: User) => {
    if (exchangeInFlight.current) return exchangeInFlight.current;
    const request = establishPlatformSession(await nextUser.getIdToken()).then(() => {
      setPlatformSessionEstablished(true);
      setError(null);
    }).catch((cause: unknown) => {
      setPlatformSessionEstablished(false);
      setError(cause instanceof Error ? cause.message : "Unable to establish the Platform session.");
      throw cause;
    }).finally(() => { exchangeInFlight.current = null; });
    exchangeInFlight.current = request;
    return request;
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(firebaseAuth(), async (nextUser) => {
        if (!active) return;
        setUser(nextUser);
        if (!nextUser) {
          setPlatformSessionEstablished(false);
          setLoading(false);
          return;
        }
        try { await establishSession(nextUser); } catch { /* state contains a safe user-facing error */ } finally { if (active) setLoading(false); }
      });
    } catch (cause) {
      queueMicrotask(() => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Unable to initialize Firebase authentication.");
        setLoading(false);
      });
    }
    return () => { active = false; unsubscribe?.(); };
  }, [establishSession]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await signInWithPopup(firebaseAuth(), new GoogleAuthProvider());
      setUser(result.user);
      await establishSession(result.user);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in with Google.");
      throw cause;
    } finally { setLoading(false); }
  }, [establishSession]);

  const sendPhoneOtp = useCallback(async (phoneNumber: string, container: HTMLElement) => {
    setError(null);
    recaptcha.current?.clear();
    recaptcha.current = new RecaptchaVerifier(firebaseAuth(), container, { size: "invisible" });
    try { setConfirmation(await signInWithPhoneNumber(firebaseAuth(), phoneNumber, recaptcha.current)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to send the verification code."); recaptcha.current.clear(); recaptcha.current = null; throw cause; }
  }, []);

  const verifyPhoneOtp = useCallback(async (code: string) => {
    if (!confirmation) throw new Error("Request a verification code first.");
    setLoading(true); setError(null);
    try {
      const result = await confirmation.confirm(code);
      setUser(result.user);
      await establishSession(result.user);
      setConfirmation(null);
      recaptcha.current?.clear(); recaptcha.current = null;
    } finally { setLoading(false); }
  }, [confirmation, establishSession]);

  const logout = useCallback(async () => {
    setLoading(true); setError(null);
    let platformFailure: unknown;
    try { await logoutPlatformSession(); } catch (cause) { platformFailure = cause; }
    try { await signOut(firebaseAuth()); }
    finally { setUser(null); setPlatformSessionEstablished(false); setConfirmation(null); setLoading(false); }
    if (platformFailure) { setError("Firebase was signed out, but the Platform logout request could not be completed."); throw platformFailure; }
  }, []);

  return <AuthContext.Provider value={{ user, loading, error, platformSessionEstablished, phoneOtpPending: Boolean(confirmation), signInWithGoogle, sendPhoneOtp, verifyPhoneOtp, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider.");
  return value;
}
