import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";
import { PageHero } from "./PageHero";
import { Section } from "./Section";
import { SiteLayout } from "./SiteLayout";
export function ContentPage({ title, description, children }: { title: string; description: string; children: ReactNode }) { return <SiteLayout><PageHero title={title} description={description} /><Section><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />{children}</Container></Section></SiteLayout>; }
