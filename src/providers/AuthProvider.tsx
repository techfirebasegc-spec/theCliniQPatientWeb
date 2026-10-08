"use client";

import { ConfirmationResult, GoogleAuthProvider, RecaptchaVerifier, User, onAuthStateChanged, signInWithPhoneNumber, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPatientProfile, establishPlatformSession, getPatientProfile, logoutPlatformSession, PlatformApiError, type PatientProfile } from "../lib/api";
import { firebaseAuth } from "../lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  platformSessionEstablished: boolean;
  patientProfile: PatientProfile | null;
  phoneOtpPending: boolean;
  signInWithGoogle: () => Promise<void>;
  sendPhoneOtp: (phoneNumber: string, recaptchaContainer: HTMLElement) => Promise<void>;
  verifyPhoneOtp: (code: string) => Promise<void>;
  retryPatientProfile: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platformSessionEstablished, setPlatformSessionEstablished] = useState(false);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const exchangeInFlight = useRef<Promise<void> | null>(null);
  const profileEnsureInFlight = useRef<Promise<PatientProfile> | null>(null);
  const recaptcha = useRef<RecaptchaVerifier | null>(null);

  const ensureActivePatientProfile = useCallback(async (nextUser: User): Promise<PatientProfile> => {
    if (profileEnsureInFlight.current) return profileEnsureInFlight.current;
    const operation = (async () => {
      let profile: PatientProfile;
      try {
        profile = await getPatientProfile();
      } catch (cause) {
        if (!(cause instanceof PlatformApiError) || cause.status !== 404 || cause.code !== "PATIENT_PROFILE_NOT_FOUND") throw cause;
        try {
          profile = await createPatientProfile(nextUser.displayName?.trim() || undefined);
        } catch (createCause) {
          if (!(createCause instanceof PlatformApiError) || createCause.status !== 409) throw createCause;
          profile = await getPatientProfile();
        }
      }
      setPatientProfile(profile);
      if (profile.status !== "ACTIVE") throw new Error("PATIENT_PROFILE_INACTIVE");
      return profile;
    })().finally(() => { profileEnsureInFlight.current = null; });
    profileEnsureInFlight.current = operation;
    return operation;
  }, []);

  const establishSession = useCallback(async (nextUser: User) => {
    if (exchangeInFlight.current) return exchangeInFlight.current;
    const request = (async () => {
      try { await establishPlatformSession(await nextUser.getIdToken()); }
      catch { throw new Error("PLATFORM_SESSION_FAILED"); }
      await ensureActivePatientProfile(nextUser);
    })().then(() => {
      setPlatformSessionEstablished(true);
      setError(null);
    }).catch((cause: unknown) => {
      setPlatformSessionEstablished(false);
      setError(profileError(cause));
      throw cause;
    }).finally(() => { exchangeInFlight.current = null; });
    exchangeInFlight.current = request;
    return request;
  }, [ensureActivePatientProfile]);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(firebaseAuth(), async (nextUser) => {
        if (!active) return;
        setUser(nextUser);
        if (!nextUser) {
          setPlatformSessionEstablished(false); setPatientProfile(null);
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
    finally { setUser(null); setPatientProfile(null); setPlatformSessionEstablished(false); setConfirmation(null); setLoading(false); }
    if (platformFailure) { setError("Firebase was signed out, but the Platform logout request could not be completed."); throw platformFailure; }
  }, []);

  const retryPatientProfile = useCallback(async () => {
    if (!user) throw new Error("Authentication is required.");
    setLoading(true); setError(null); setPlatformSessionEstablished(false);
    try { await ensureActivePatientProfile(user); setPlatformSessionEstablished(true); }
    catch (cause) { setError(profileError(cause)); throw cause; }
    finally { setLoading(false); }
  }, [ensureActivePatientProfile, user]);

  return <AuthContext.Provider value={{ user, loading, error, platformSessionEstablished, patientProfile, phoneOtpPending: Boolean(confirmation), signInWithGoogle, sendPhoneOtp, verifyPhoneOtp, retryPatientProfile, logout }}>{children}</AuthContext.Provider>;
}

function profileError(cause: unknown): string {
  if (cause instanceof Error && cause.message === "PATIENT_PROFILE_INACTIVE") return "Your patient profile is not active. Please contact support before booking.";
  if (cause instanceof Error && cause.message === "PLATFORM_SESSION_FAILED") return "We couldn’t establish your session. Please sign in again.";
  return "We couldn’t prepare your patient profile. Please try again.";
}

export function useAuth(): AuthContextValue {
  const value = useOptionalAuth();
  if (!value) throw new Error("useAuth must be used within AuthProvider.");
  return value;
}

export function useOptionalAuth(): AuthContextValue | null {
  return useContext(AuthContext);
}
