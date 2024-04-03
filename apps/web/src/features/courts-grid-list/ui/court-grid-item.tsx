import type { Court, CourtAsset, CourtLocation } from "@maidanchyk/prisma";
import { Heart, MapPin } from "lucide-react";
import {
  AspectRatio,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from "@maidanchyk/ui";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "../../../server/trpc";

interface Props {
  court: Pick<Court, "id" | "events" | "name" | "price" | "description"> & {
    location: Pick<CourtLocation, "formattedAddress">;
    photos: Pick<CourtAsset, "url">[];
    savedBy: { id: string }[];
  };
}

export function CourtGridItem({ court }: Props) {
  const [saved, setSaved] = useState(!!court.savedBy.length);

  const { mutateAsync: save } = trpc.courts.save.useMutation();
  const { mutateAsync: unsave } = trpc.courts.unsave.useMutation();

  const handleToggleSaved = async () => {
    try {
      setSaved((state) => !state);

      if (saved) {
        await unsave({ id: court.id });
      } else {
        await save({ id: court.id });
      }
    } catch (error) {
      setSaved((state) => !state);
    }
  };

  return (
    <li className="relative">
      <button
        className="absolute right-4 top-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white transition hover:outline-none hover:ring-2 hover:ring-orange-500 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:h-10 sm:w-10"
        onClick={handleToggleSaved}
        type="button">
        <span className="sr-only">
          {saved ? "Видалити зі збереженого" : "Додати до збереженого"}
        </span>
        <Heart
          aria-hidden="true"
          className={cn("h-8 w-8 translate-y-[1px] text-orange-600 transition sm:h-6 sm:w-6", {
            "fill-orange-600": saved,
          })}
        />
      </button>
      <Link
        className="focus-visible:ring-ring ring-offset-background group relative block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        href={`/courts/${court.id}`}>
        <AspectRatio className="mb-2 overflow-hidden rounded-md" ratio={1}>
          <Image
            alt={`${court.name}'s thumbnail`}
            className="object-cover transition duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-80"
            fill
            src={court.photos[0].url}
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
          <p className="text-lg font-semibold text-orange-600">{court.price}₴</p>
        </div>
      </Link>
    </li>
  );
}
