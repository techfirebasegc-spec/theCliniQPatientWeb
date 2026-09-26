import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
export function SiteLayout({ children }: { children: ReactNode }) { return <><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content">{children}</main><Footer /></>; }
