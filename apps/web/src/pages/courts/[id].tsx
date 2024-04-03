import {
  AspectRatio,
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  GoogleMap,
  GoogleMapMarker,
  Skeleton,
  cn,
} from "@maidanchyk/ui";
import { Heart, MapPin } from "lucide-react";
import { useRouter } from "next/router";
import Image from "next/image";
import type { Court, CourtAsset, CourtLocation } from "@maidanchyk/prisma";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useState } from "react";
import { trpc } from "../../server/trpc";
import { withUser } from "../../shared/lib/ssr";
import { eventTypeToLabel, getInitials } from "../../shared/lib/strings";
import { StackedLayout } from "../../widgets/layout";
import { useMediaQuery } from "../../shared/hooks";

export default function ViewCourt() {
  const router = useRouter();

  const { data: court } = trpc.courts.get.useQuery({ id: router.query.id as string });

  return (
    <StackedLayout spacing>
      {/* <div>
        <Button onClick={router.back} variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" /> Назад
        </Button>
      </div> */}

      {court ? (
        <>
          <MainInformationSection court={court} />
          <PhotosSection court={court} />

          <div className="flex flex-col gap-4 lg:flex-row-reverse">
            <div className="flex flex-col gap-4 lg:w-4/12">
              <ContactPersonSection court={court} />
            </div>

            <div className="flex flex-col gap-4 lg:w-8/12">
              <AboutSection court={court} />
              <LocationSection court={court} />
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();

function PhotosSection({
  court,
}: {
  court: Omit<Court, "createdAt" | "updatedAt"> & {
    photos: Omit<CourtAsset, "createdAt" | "updatedAt">[];
  };
}) {
  const md = useMediaQuery(768);

  return (
    <PhotoProvider>
      <Carousel className="w-full max-w-full overflow-hidden rounded-md">
        <CarouselContent>
          {court.photos.map((photo) => (
            <CarouselItem key={photo.id}>
              <AspectRatio ratio={md ? 30 / 10 : 16 / 10}>
                <PhotoView src={photo.url}>
                  <Image
                    alt={photo.pathname}
                    className="rounded-md object-cover"
                    fill
                    src={photo.url}
                  />
                </PhotoView>
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </PhotoProvider>
  );
}

function MainInformationSection({
  court,
}: {
  court: Omit<Court, "createdAt" | "updatedAt"> & { savedBy: { id: string }[] };
}) {
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
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl">
          {court.name}
        </h1>
        <button
          className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full bg-white transition hover:outline-none hover:ring-2 hover:ring-orange-500 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          onClick={handleToggleSaved}
          type="button">
          <span className="sr-only">
            {saved ? "Видалити зі збереженого" : "Додати до збереженого"}
          </span>
          <Heart
            aria-hidden="true"
            className={cn("h-6 w-6 translate-y-[1px] text-orange-600 transition", {
              "fill-orange-600": saved,
            })}
          />
        </button>
      </div>
      <p className="text-xl font-semibold tracking-tight text-orange-600">{court.price}₴</p>
    </div>
  );
}

function AboutSection({ court }: { court: Omit<Court, "createdAt" | "updatedAt"> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Опис</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="flex flex-wrap gap-1">
          {court.events.map((event) => (
            <li key={event}>
              <Badge>{eventTypeToLabel(event)}</Badge>
            </li>
          ))}
        </ul>

        <p>{court.description}</p>
      </CardContent>
    </Card>
  );
}

function LocationSection({
  court,
}: {
  court: Omit<Court, "createdAt" | "updatedAt"> & {
    location: Omit<CourtLocation, "createdAt" | "updatedAt">;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Місцезнахождення</CardTitle>
        <CardDescription className="inline-flex items-center">
          <MapPin className="mr-1 h-4 w-4 min-w-[16px]" /> {court.location.formattedAddress}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GoogleMap
          defaultCenter={{ lat: court.location.lat, lng: court.location.lng }}
          height={400}>
          <GoogleMapMarker position={court.location} />
        </GoogleMap>
      </CardContent>
    </Card>
  );
}

function ContactPersonSection({
  className,
  court,
}: {
  className?: string;
  court: Omit<Court, "createdAt" | "updatedAt">;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Контактна особа</CardTitle>
      </CardHeader>
      <CardContent className="flex">
        <div className="mr-4 flex-shrink-0 self-start">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{getInitials(court.contactPerson)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold">{court.contactPerson}</h4>
          <a className="text-sm hover:text-orange-600" href={`mailto:${court.contactEmail}`}>
            {court.contactEmail}
          </a>
          <a className="text-sm hover:text-orange-600" href={`tel:${court.contactPhone}`}>
            {court.contactPhone}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function Loader() {
  return (
    <>
      <Skeleton className="h-[40px] w-full rounded-md sm:w-2/3" />
      <Skeleton className="h-[28px] w-1/5 rounded-md" />
      <AspectRatio ratio={30 / 10}>
        <Skeleton className="h-full w-full rounded-md" />
      </AspectRatio>
      <div className="flex flex-col gap-4 lg:flex-row-reverse">
        <div className="flex flex-col gap-4 lg:w-4/12">
          <Skeleton className="h-[150px] w-full rounded-md" />
        </div>
        <div className="flex flex-col gap-4 lg:w-8/12">
          <Skeleton className="h-[200px] w-full rounded-md" />
          <Skeleton className="h-[500px] w-full rounded-md" />
        </div>
      </div>
    </>
  );
}
