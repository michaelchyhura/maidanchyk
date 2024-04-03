import type { Court, CourtAsset, CourtLocation } from "@maidanchyk/prisma";
import { cn } from "@maidanchyk/ui";
import type { ReactNode } from "react";
import { CourtGridEmptyState, CourtGridItem, CourtGridLoader } from "./ui";

interface Props {
  courts: (Pick<Court, "id" | "events" | "name" | "price" | "description"> & {
    location: Pick<CourtLocation, "formattedAddress">;
    photos: Pick<CourtAsset, "url">[];
    savedBy: { id: string }[];
  })[];
  cols?: 3 | 4;
  loading?: boolean;
  children?: ReactNode;
}

export function CourtsGridList({ courts, cols = 4, loading, children }: Props) {
  return loading ? (
    <CourtGridLoader />
  ) : courts.length ? (
    <>
      <ul
        className={cn(
          "grid gap-4",
          { "sm:grid-cols-2 lg:grid-cols-3": cols === 3 },
          { "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4": cols === 4 },
        )}>
        {courts.map((court) => (
          <CourtGridItem court={court} key={court.id} />
        ))}
      </ul>
      {children}
    </>
  ) : (
    <CourtGridEmptyState />
  );
}
