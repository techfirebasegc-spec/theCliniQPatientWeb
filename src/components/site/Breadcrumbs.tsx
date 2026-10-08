import Link from "next/link";
import { Container } from "./Container";
export type Crumb = { label: string; href?: string };
export function Breadcrumbs({ items, inContainer = false }: { items: Crumb[]; inContainer?: boolean }) {
  const navigation = <nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={`${item.label}-${index}`}>{index > 0 ? <span aria-hidden="true">/</span> : null}{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>;
  return inContainer ? <Container>{navigation}</Container> : navigation;
}
