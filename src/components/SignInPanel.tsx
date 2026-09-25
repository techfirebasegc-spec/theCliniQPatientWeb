"use client";

import { FormEvent, useRef, useState } from "react";
import { useAuth } from "../providers/AuthProvider";

export function SignInPanel() {
  const { loading, error, platformSessionEstablished, phoneOtpPending, signInWithGoogle, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const recaptcha = useRef<HTMLDivElement>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const sendCode = async (event: FormEvent) => {
    event.preventDefault(); setLocalError(null);
    if (!recaptcha.current) return;
    try { await sendPhoneOtp(phoneNumber.trim(), recaptcha.current); } catch { setLocalError("Unable to send the verification code. Check your phone number and try again."); }
  };
  const verifyCode = async (event: FormEvent) => {
    event.preventDefault(); setLocalError(null);
    try { await verifyPhoneOtp(code.trim()); } catch { setLocalError("Unable to verify the code or establish the Platform session."); }
  };

  return <section className="card"><p className="muted">Secure patient sign-in</p><h1>Sign in</h1>{platformSessionEstablished ? <p className="status">Your Platform session is established.</p> : <><div className="actions"><button className="button" disabled={loading} onClick={() => void signInWithGoogle()}>Continue with Google</button></div><form onSubmit={phoneOtpPending ? verifyCode : sendCode}><label className="field"><span>Phone number</span><input type="tel" autoComplete="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} disabled={phoneOtpPending || loading} placeholder="+91…" required /></label>{phoneOtpPending ? <label className="field"><span>Verification code</span><input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value)} disabled={loading} required /></label> : null}<div className="actions"><button className="button button--secondary" disabled={loading}>{phoneOtpPending ? "Verify OTP" : "Continue with Phone"}</button></div></form><div ref={recaptcha} /></>}{error || localError ? <p className="error" role="alert">{localError ?? error}</p> : null}</section>;
}
