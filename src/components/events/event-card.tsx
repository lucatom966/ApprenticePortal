import { Calendar, Clock, MapPin } from "lucide-react";
import type { Event } from "@/types";

export function EventCard({ event }: { event: Event }) {
  const date = new Date(event.date);
  const day = date.toLocaleDateString("de-CH", { day: "2-digit" });
  const month = date.toLocaleDateString("de-CH", { month: "short" });
  const weekday = date.toLocaleDateString("de-CH", { weekday: "long" });

  return (
    <div className="flex gap-5 p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-accent)]/30 transition-colors">
      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 shrink-0 text-[var(--color-accent)]">
        <span className="text-xl font-bold leading-none">{day}</span>
        <span className="text-xs font-medium uppercase">{month}</span>
      </div>

      <div className="flex flex-col gap-1.5 min-w-0">
        <h3 className="font-semibold text-[var(--color-foreground)] truncate">{event.title}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-muted-foreground)]">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {weekday}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {event.time} Uhr
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} />
            {event.location}
          </span>
        </div>
        <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed line-clamp-2 mt-0.5">
          {event.description}
        </p>
      </div>
    </div>
  );
}
