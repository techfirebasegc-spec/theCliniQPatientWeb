import type { ReactNode } from "react";
import { AuthProvider } from "../../src/providers/AuthProvider";
export default function SignInLayout({ children }: { children: ReactNode }) { return <AuthProvider>{children}</AuthProvider>; }
