import type { ReactNode } from "react";
export function Section({ children, tint = false, compact = false }: { children: ReactNode; tint?: boolean; compact?: boolean }) { return <section className={`site-section${tint ? " site-section--tint" : ""}${compact ? " site-section--compact" : ""}`}>{children}</section>; }
