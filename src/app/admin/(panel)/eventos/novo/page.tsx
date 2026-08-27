import PageHeader from "@/components/admin/PageHeader";
import EventForm from "@/components/admin/EventForm";
import { createEvent } from "@/lib/actions/events";

export const metadata = { title: "Novo Evento" };

export default function NovoEventoPage() {
  return (
    <div>
      <PageHeader title="Novo evento" subtitle="Cadastre um workshop, aula ou experiência" />
      <EventForm action={createEvent} />
    </div>
  );
}
