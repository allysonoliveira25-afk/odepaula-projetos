import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import EventForm from "@/components/admin/EventForm";
import { updateEvent } from "@/lib/actions/events";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar Evento" };

export default async function EditarEventoPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) notFound();

  const updateWithId = updateEvent.bind(null, event.id);

  return (
    <div>
      <PageHeader title="Editar evento" subtitle={event.title} />
      <EventForm
        action={updateWithId}
        defaultValues={{
          title: event.title,
          description: event.description,
          date: event.date.toISOString().slice(0, 10),
          time: event.time,
          location: event.location,
          city: event.city,
          imageUrl: event.imageUrl,
          registrationUrl: event.registrationUrl,
          status: event.status,
          order: event.order,
        }}
      />
    </div>
  );
}
