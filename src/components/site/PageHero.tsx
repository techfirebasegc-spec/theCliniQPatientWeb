import { Container } from "./Container";
export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) { return <section className="page-hero"><Container>{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h1>{title}</h1><p>{description}</p></Container></section>; }
