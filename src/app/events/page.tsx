import { events } from "@/lib/mock-data";
import { EventCard } from "@/components/events/event-card";

export default function EventsPage() {
  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight mb-2">Events</h1>
        <p className="text-[var(--color-muted-foreground)]">Kommende Veranstaltungen und Termine für Lernende.</p>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
