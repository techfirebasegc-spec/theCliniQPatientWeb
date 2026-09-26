import Link from "next/link";
import type { ReactNode } from "react";
export function Button({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) { return <Link className={`button${secondary ? " button--secondary" : ""}`} href={href}>{children}</Link>; }
