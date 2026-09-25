"use client";

import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";

export function HomeAuthCard() {
  const { user, loading, error, platformSessionEstablished, logout } = useAuth();
  return <section className="card"><p className="muted">Patient application</p><h1>Welcome to TheCliniQ</h1><p>Sign in securely with Google or your phone to prepare for future Platform services.</p>{loading ? <p className="status">Checking your secure session…</p> : platformSessionEstablished && user ? <><p className="status">Your Platform session is established.</p><div className="actions"><button className="button" onClick={() => { void logout().catch(() => undefined); }}>Sign out</button></div></> : <div className="actions"><Link className="button" href="/sign-in">Sign in</Link></div>}{error ? <p className="error" role="alert">{error}</p> : null}</section>;
}
