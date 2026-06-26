import { GraduationCap } from "lucide-react";
import { SPECIALTY_LABELS, SPECIALTY_COLORS, type Specialty } from "@/types";
import { cn } from "@/lib/utils";

export function SpecialtyBadge({ specialty, size = "sm" }: { specialty: Specialty; size?: "sm" | "md" }) {
  const { bg, text, border } = SPECIALTY_COLORS[specialty];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        bg, text, border,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"
      )}
    >
      <GraduationCap size={size === "sm" ? 10 : 12} />
      {SPECIALTY_LABELS[specialty]}
    </span>
  );
}
