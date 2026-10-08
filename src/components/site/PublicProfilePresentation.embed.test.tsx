import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PublicProfilePresentation, weekdayLabel } from "./PublicProfilePresentation";

const base = { kind: "Doctor" as const, name: "Example Doctor", presentation: { templateKey: "professional" as const, rendererKey: "professional-v1" as const, primaryColor: "#123456", secondaryColor: null, accentColor: null, layoutOptions: { heroLayout: "centered" }, sectionVisibility: {}, assets: [{ kind: "HERO_IMAGE" as const, url: "/v1/public/doctors/example/presentation-assets/HERO_IMAGE" }] }, bookingHref: "/services/offering/existing", bookingTarget: "_top" as const, mode: "embed" as const, sections: [{ key: "services", title: "Services", content: <p>Existing public service</p> }] };

for (const templateKey of ["professional", "premium", "minimal"] as const) test(`${templateKey} presentation renders in embed mode with the existing booking flow`, () => {
  const markup = renderToStaticMarkup(<PublicProfilePresentation {...base} presentation={{ ...base.presentation, templateKey, rendererKey: `${templateKey}-v1` }} />);
  assert.match(markup, new RegExp(`template-${templateKey}`));
  assert.match(markup, /presentation-mode-embed/);
  assert.match(markup, /--presentation-primary:#123456/);
  assert.match(markup, /target="_top"/);
  assert.match(markup, /\/services\/offering\/existing/);
  assert.doesNotMatch(markup, /site-header|site-footer/);
});

test("profile detail sections use the shared responsive detail grid", () => {
  const markup = renderToStaticMarkup(<PublicProfilePresentation {...base} summary="A published public profile summary." sections={[{ key: "about", title: "About", group: "details", content: <p>Published profile detail</p> }]} />);
  assert.match(markup, /profile-summary-copy/);
  assert.match(markup, /profile-detail-grid/);
  assert.match(markup, /profile-detail-card/);
});

test("missing profile media receives the branded default image", () => {
  const markup = renderToStaticMarkup(<PublicProfilePresentation {...base} />);
  assert.match(markup, /\/brand\/consultation\.png/);
  assert.match(markup, /profile-photo--default/);
  assert.doesNotMatch(markup, /profile-placeholder/);
});

test("clinic operating weekdays use the existing Monday-through-Sunday contract", () => {
  assert.equal(weekdayLabel(1), "Monday");
  assert.equal(weekdayLabel(7), "Sunday");
});
