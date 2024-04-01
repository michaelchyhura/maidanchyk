import { Court, CourtAsset, CourtLocation } from "@maidanchyk/prisma";
import {
  AspectRatio,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@maidanchyk/ui";
import { MapPin, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  courts: (Pick<Court, "id" | "events" | "name" | "price" | "description"> & {
    location: Pick<CourtLocation, "formattedAddress">;
    photos: Pick<CourtAsset, "url">[];
  })[];

  loading?: boolean;
  children: ReactNode;
};

export const CourtsGridList = ({ courts, loading, children }: Props) => {
  return loading ? (
    <Loader />
  ) : !!courts.length ? (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courts.map((court) => (
          <li key={court.id}>
            <Link
              className="focus-visible:ring-ring ring-offset-background group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              href={`/courts/${court.id}`}>
              <AspectRatio className="mb-2 overflow-hidden rounded-md" ratio={1}>
                <Image
                  className="object-cover transition duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-80"
                  src={court.photos[0].url}
                  alt={`${court.name}'s thumbnail`}
                  fill
                />
              </AspectRatio>
              <h4 className="mb-1 line-clamp-2 font-semibold tracking-tight">{court.name}</h4>
              {/* <p className="mb-1 line-clamp-2 text-sm text-zinc-500">{court.description}</p> */}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="focus-visible:ring-ring ring-offset-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                    <p className="inline-flex items-center justify-start text-sm text-zinc-500">
                      <MapPin className="mr-1 h-4 w-4 min-w-[16px]" />{" "}
                      <span className="line-clamp-1">{court.location.formattedAddress}</span>
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{court.location.formattedAddress}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-semibold">{court.price}₴</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </>
  ) : (
    <EmptyState />
  );
};

const Loader = () => {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <li key={index} className="flex flex-col">
          <AspectRatio className="mb-2 rounded-md" ratio={1}>
            <Skeleton className="h-full w-full" />
          </AspectRatio>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </li>
      ))}
    </ul>
  );
};

const EmptyState = () => {
  return (
    <div className="space-y-4 rounded-md border border-dashed border-zinc-200 p-12 text-center">
      <SearchX className="mx-auto h-12 w-12 text-zinc-400" />
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">No courts available</h3>
        <p className="text-sm text-zinc-500">
          Unfortunately, no courts matched your search criteria
        </p>
      </div>
    </div>
  );
};
