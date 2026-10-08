import Link from "next/link";
import type { PatientAppointment } from "../../lib/api";
import { CardActions, CardContainer, CardHeader } from "./Cards";

const stateLabel: Record<PatientAppointment["status"], string> = {
  PAYMENT_PENDING: "Payment pending", CONFIRMED: "Confirmed", IN_PROGRESS: "Consultation in progress", COMPLETED: "Completed", CANCELLED: "Cancelled", EXPIRED: "Expired", PAYMENT_FAILED: "Payment failed",
};

function appointmentDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Appointment date unavailable" : date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
function appointmentTime(startsAt: string, endsAt: string) { const starts = new Date(startsAt); const ends = new Date(endsAt); return Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime()) ? "Appointment time unavailable" : `${starts.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} – ${ends.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZoneName: "short" })}`; }

export function AppointmentCard({ appointment }: { appointment: PatientAppointment }) {
  const href = `/appointments/${encodeURIComponent(appointment.id)}`;
  return <CardContainer className="appointment-card"><CardHeader label="Appointment" shareHref="/appointments" shareTitle="My appointments | The CliniQ" shareLabel={`Share appointment for ${appointment.serviceName}`} /><div className="appointment-card-heading"><h2>{appointment.serviceName}</h2><span className="appointment-status">{stateLabel[appointment.status]}</span></div><div className="appointment-card-provider"><span>With</span>{appointment.doctor ? <p>{appointment.doctor.displayName}</p> : null}{appointment.clinic ? <p>{appointment.clinic.displayName}</p> : null}</div><div className="appointment-card-when"><p>{appointmentDate(appointment.startsAt)}</p><p>{appointmentTime(appointment.startsAt, appointment.endsAt)}</p></div><CardActions><Link className="card-action card-action--primary" href={href}>View appointment →</Link><button className="card-action card-action--coming-soon" type="button" disabled>Chat · coming soon</button></CardActions></CardContainer>;
}
