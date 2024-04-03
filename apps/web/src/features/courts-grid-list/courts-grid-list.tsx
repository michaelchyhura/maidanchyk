import type { Court, CourtAsset, CourtLocation } from "@maidanchyk/prisma";
import type { ReactNode } from "react";
import { CourtGridEmptyState, CourtGridItem, CourtGridLoader } from "./ui";

interface Props {
  courts: (Pick<Court, "id" | "events" | "name" | "price" | "description"> & {
    location: Pick<CourtLocation, "formattedAddress">;
    photos: Pick<CourtAsset, "url">[];
    savedBy: { id: string }[];
  })[];
  loading?: boolean;
  children: ReactNode;
}

export function CourtsGridList({ courts, loading, children }: Props) {
  return loading ? (
    <CourtGridLoader />
  ) : courts.length ? (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
