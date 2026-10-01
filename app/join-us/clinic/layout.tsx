import type { ReactNode } from "react";
import { AuthProvider } from "../../../src/providers/AuthProvider";

export default function ClinicApplicationLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
