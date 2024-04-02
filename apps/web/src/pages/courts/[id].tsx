import {
  AspectRatio,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
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
} from "@maidanchyk/ui";
import { ArrowLeft, MapPin } from "lucide-react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Image from "next/image";
import type { Court, CourtAsset, CourtLocation } from "@maidanchyk/prisma";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { trpc } from "../../server/trpc";
import { withUser } from "../../shared/lib/ssr";
import { eventTypeToLabel, getInitials } from "../../shared/lib/strings";
import { useModal } from "../../shared/hooks/use-modal";
import { StackedLayout } from "../../widgets/layout";

export default function ViewCourt() {
  const router = useRouter();

  const { data: court } = trpc.courts.get.useQuery({ id: router.query.id as string });

  return (
    <StackedLayout spacing>
      <div>
        <Button onClick={router.back} variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" /> Назад
        </Button>
      </div>

      {court ? (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-col gap-4 lg:w-8/12">
            <PhotosSection court={court} />
            <MainInformationSection className="lg:hidden" court={court} />
            <AboutSection court={court} />
            <ContactPersonSection className="lg:hidden" court={court} />
            <LocationSection court={court} />
          </div>

          <div className="hidden flex-col gap-4 lg:flex lg:w-4/12">
            <MainInformationSection court={court} />
            <ContactPersonSection court={court} />
          </div>
        </div>
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
  return (
    <PhotoProvider>
      <Carousel className="w-full max-w-full overflow-hidden rounded-md">
        <CarouselContent>
          {court.photos.map((photo) => (
            <CarouselItem key={photo.id}>
              <AspectRatio ratio={16 / 10}>
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
  className,
  court,
}: {
  className?: string;
  court: Omit<Court, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string };
}) {
  const { isOpen: phoneVisible, open: showPhone } = useModal(false);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{court.name}</CardTitle>
        <CardDescription>{dayjs(court.createdAt).format("ll")}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-xl font-semibold">{court.price}₴</p>
        {phoneVisible ? (
          <Button asChild className="w-full">
            <a href={`tel:${court.contactPhone}`}>{court.contactPhone}</a>
          </Button>
        ) : (
          <Button className="w-full" onClick={showPhone}>
            Показати телефон
          </Button>
        )}
      </CardContent>
    </Card>
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
        <div className="mr-4 flex-shrink-0 self-center">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{getInitials(court.contactPerson)}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h4 className="font-bold">{court.contactPerson}</h4>
          <a className="text-sm text-zinc-500" href={`mailto:${court.contactEmail}`}>
            {court.contactEmail}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function Loader() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="flex flex-col gap-4 lg:w-8/12">
        <AspectRatio ratio={16 / 10}>
          <Skeleton className="h-full w-full rounded-md" />
        </AspectRatio>
        <Skeleton className="h-[150px] w-full rounded-md lg:hidden" />
        <Skeleton className="h-[200px] w-full rounded-md" />
        <Skeleton className="h-[150px] w-full rounded-md lg:hidden" />
        <Skeleton className="h-[500px] w-full rounded-md" />
      </div>

      <div className="hidden flex-col gap-4 lg:flex lg:w-4/12">
        <Skeleton className="h-[200px] w-full rounded-md" />
        <Skeleton className="h-[150px] w-full rounded-md" />
      </div>
    </div>
  );
}
