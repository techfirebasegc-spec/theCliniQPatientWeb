import Link from "next/link";
import { SignInPanel } from "../../src/components/SignInPanel";

export default function SignInPage() {
  return <main className="shell"><header className="header"><Link className="brand" href="/">TheCliniQ</Link></header><SignInPanel /></main>;
}
