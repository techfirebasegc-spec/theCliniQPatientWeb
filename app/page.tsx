import Link from "next/link";
import { HomeAuthCard } from "../src/components/HomeAuthCard";

export default function HomePage() {
  return <main className="shell"><header className="header"><Link className="brand" href="/">TheCliniQ</Link><nav className="nav"><Link href="/doctors">Doctors</Link><Link href="/services">Services</Link><Link className="button button--secondary" href="/sign-in">Sign in</Link></nav></header><HomeAuthCard /></main>;
}
