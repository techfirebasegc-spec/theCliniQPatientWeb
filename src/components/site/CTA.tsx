import { Button } from "./Button";
import { BOOKING_URL } from "./links";

export function CTA({ title = "Your next step in care starts here.", description = "Explore your options, then continue to The CliniQ’s consultation booking.", href = BOOKING_URL, label = "Book Consultation" }: { title?: string; description?: string; href?: string; label?: string }) {
  return <section className="cta"><div className="cta-grid"><div><p className="eyebrow">Your Health Partner</p><h2>{title}</h2><p>{description}</p></div><Button href={href}>{label} <span aria-hidden="true">↗</span></Button></div></section>;
}
