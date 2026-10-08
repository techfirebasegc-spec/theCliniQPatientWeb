import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../src/components/site/Breadcrumbs";
import { ClinicServiceCard, DoctorReferenceCard } from "../../../src/components/site/Cards";
import { SiteLayout } from "../../../src/components/site/SiteLayout";
import { pageMetadata } from "../../../src/lib/metadata";
import { publicClinic } from "../../../src/lib/public-api-server";
import { PublicProfilePresentation } from "../../../src/components/site/PublicProfilePresentation";
import { ProfileCardList } from "../../../src/components/site/ProfileCardList";
import { formatProfileTime, weekdayLabel } from "../../../src/lib/public-profile-format";

type Props = { params: Promise<{ clinicId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clinicId: slug } = await params;
  const data = await publicClinic(slug);
  const name = data?.clinic.displayName ?? "Clinic";
  return pageMetadata(name, `View currently published services for ${name} at The CliniQ.`, `/clinics/${encodeURIComponent(slug)}`);
}

export default async function ClinicDetailPage({ params }: Props) {
  const { clinicId: slug } = await params;
  const data = await publicClinic(slug);
  if (!data) notFound();
  const c=data.clinic,address=c.address?[c.address.line1,c.address.line2,c.address.locality,c.address.region,c.address.postalCode,c.address.countryCode].filter(Boolean).join(", "):null,hoursByWeekday=new Map(c.operatingHours?.map(hour=>[hour.weekday,hour])),details=[c.contact?.phone||c.contact?.email?{key:"contact",title:"Contact",group:"details" as const,content:<div className="profile-list">{c.contact.phone?<p>{c.contact.phone}</p>:null}{c.contact.email?<p>{c.contact.email}</p>:null}</div>}:null,address?{key:"address",title:"Address",group:"details" as const,content:<p>{address}</p>}:null,c.operatingHours?.length?{key:"hours",title:"Clinic Operating Hours",group:"details" as const,content:<div className="profile-list">{[1,2,3,4,5,6,7].map(weekday=>{const hours=hoursByWeekday.get(weekday);return <p key={weekday}><strong>{weekdayLabel(weekday)}</strong><span>{hours?`${formatProfileTime(hours.opensAt)} – ${formatProfileTime(hours.closesAt)}`:"Closed"}</span></p>;})}</div>}:null].filter((section): section is NonNullable<typeof section> => section!==null); return <SiteLayout><Breadcrumbs inContainer items={[{label:"Home",href:"/"},{label:"Clinics",href:"/clinics"},{label:c.displayName}]}/><PublicProfilePresentation kind="Clinic" name={c.displayName} summary={c.about} photo={c.photo} presentation={data.presentation} bookingHref={data.services.length?`/book/clinics/${encodeURIComponent(slug)}`:undefined} shareHref={`/clinics/${encodeURIComponent(slug)}`} sections={[...details,{key:"doctors",title:"Doctors",content:data.doctors.length?<ProfileCardList itemLabel="doctor">{data.doctors.map(x=><DoctorReferenceCard key={x.slug} doctor={x}/>)}</ProfileCardList>:<p>No doctors are currently listed.</p>},{key:"services",title:"Services",tint:true,content:data.services.length?<ProfileCardList itemLabel="service">{data.services.map(x=><ClinicServiceCard key={x.id} clinic={c} service={x}/>)}</ProfileCardList>:<p>No services are currently listed.</p>}]}/></SiteLayout>;
}
