import { ContentPage } from "../../src/components/site/ContentPage";
import { CONTACT_EMAIL, GOOGLE_PLAY_URL } from "../../src/components/site/links";
import { pageMetadata } from "../../src/lib/metadata";
export const metadata = pageMetadata("Contact", "Contact The CliniQ. Online enquiries will be connected when an approved secure workflow is available.", "/contact");
export default function ContactPage() { return <ContentPage title="Let’s get in touch." description="For general enquiries about The CliniQ, reach out by email.">
  <div className="contact-layout"><article className="contact-panel"><p className="eyebrow">Email The CliniQ</p><h2>How can we help?</h2><p>Have a question about The CliniQ or want to get in touch with the team?</p><a className="contact-address" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <span aria-hidden="true">↗</span></a><p className="field-help">Opens your email application.</p></article><aside className="contact-aside"><p className="eyebrow">On your phone</p><h2>Take The CliniQ with you.</h2><p>Find The CliniQ on Google Play.</p><a className="button button--secondary" href={GOOGLE_PLAY_URL}>Get the App ↗</a><p className="contact-note">Online enquiry forms are coming soon.</p></aside></div>
</ContentPage>; }
