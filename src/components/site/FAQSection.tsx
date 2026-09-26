const questions = [
  { q: "Can I explore doctors without signing in?", a: "Yes. You can browse doctor profiles, services, and availability without signing in." },
  { q: "Where do I book a consultation?", a: "Book Consultation takes you to the existing The CliniQ booking website. You can also get The CliniQ app on Google Play." },
  { q: "Does health information replace a consultation?", a: "No. General health information does not replace advice from a qualified healthcare professional." },
];
export function FAQSection() { return <div className="faq">{questions.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>; }
