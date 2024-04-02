import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  GoogleMap,
  Input,
  Textarea,
  useToast,
} from "@maidanchyk/ui";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/router";
import type { Court, CourtAsset, CourtCity, CourtLocation } from "@maidanchyk/prisma";
import axios from "axios";
import { useAuth } from "../../shared/providers/auth";
import { Dropzone } from "../dropzone";
import { GooglePlacesAutocomplete } from "../google-places-autocomplete";
import {
  IVANO_FRANKIVSK_CITY,
  IVANO_FRANKIVSK_COORDINATES,
} from "../../shared/constants/google-places";
import { COURT_EVENTS } from "../../shared/constants/options";
import { compress } from "../../shared/lib/files";
import { trpc } from "../../server/trpc";
import { courtSchema } from "./lib/validation";

interface Props {
  court?: Omit<Court, "createdAt" | "updatedAt"> & {
    photos: Omit<CourtAsset, "createdAt" | "updatedAt">[];
    location: Omit<CourtLocation, "createdAt" | "updatedAt">;
    city: Omit<CourtCity, "createdAt" | "updatedAt">;
  };
}

export function CourtForm({ court }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const { mutateAsync: createCourt } = trpc.courts.create.useMutation();
  const { mutateAsync: updateCourt } = trpc.courts.update.useMutation();

  const form = useForm<z.infer<typeof courtSchema>>({
    resolver: zodResolver(courtSchema),
    defaultValues: court
      ? {
          name: court.name,
          description: court.description,
          price: court.price.toString(),
          events: court.events,
          photos: court.photos,
          city: {
            description: court.city.description,
            place_id: court.city.placeId,
            structured_formatting: {
              main_text: court.city.mainText,
              secondary_text: court.city.secondaryText,
            },
            types: court.city.types,
          },
          location: court.location,
          contactPerson: court.contactPerson,
          contactEmail: court.contactEmail,
          contactPhone: court.contactPhone,
        }
      : {
          name: "",
          description: "",
          price: "",
          events: [],
          photos: [],
          city: IVANO_FRANKIVSK_CITY,
          location: IVANO_FRANKIVSK_COORDINATES,
          contactPerson: user?.name || "",
          contactEmail: user?.email || "",
          contactPhone: user?.phone || "",
        },
  });

  const handleSubmit = async (values: z.infer<typeof courtSchema>) => {
    if (court) {
      try {
        const uploadedPhotos = values.photos.filter((photo) => !(photo instanceof File));
        const removedPhotos = court.photos.filter((photo) =>
          uploadedPhotos.every((p: { id: string }) => p.id !== photo.id),
        );

        const photos = await Promise.all(
          values.photos.map(async (photo) => {
            if (photo instanceof File) {
              const blob = await upload(photo.name, await compress(photo), {
                access: "public",
                handleUploadUrl: "/api/blob/upload",
              });

              return {
                ...blob,
                size: photo.size,
              };
            }

            return photo;
          }),
        );

        const [geocode] = await getGeocode({ location: values.location });
        const location = {
          placeId: geocode.place_id,
          formattedAddress: geocode.formatted_address,
          lat: geocode.geometry.location.lat(),
          lng: geocode.geometry.location.lng(),
        };

        await updateCourt({ id: court.id, values: { ...values, photos, location } });

        await Promise.all(
          removedPhotos.map((photo) => axios.delete(`/api/blob/delete?url=${photo.url}`)),
        );

        toast({ title: "Майданчик успішно оновлено" });
        router.push(`/courts/${court.id}`);
      } catch {
        toast({ title: "Упс, щось трапилось...", description: "Будь ласка, спробуйте ще раз" });
      }
    } else {
      try {
        const photos = await Promise.all(
          values.photos.map(async (file: File) => {
            const blob = await upload(file.name, await compress(file), {
              access: "public",
              handleUploadUrl: "/api/blob/upload",
            });

            return {
              ...blob,
              name: file.name,
              size: file.size,
            };
          }),
        );

        const [geocode] = await getGeocode({ location: values.location });
        const location = {
          placeId: geocode.place_id,
          formattedAddress: geocode.formatted_address,
          lat: geocode.geometry.location.lat(),
          lng: geocode.geometry.location.lng(),
        };

        const court = await createCourt({ ...values, photos, location });

        toast({ title: "Майданчик успішно опубліковано" });
        router.push(`/courts/${court.id}`);
      } catch {
        toast({ title: "Упс, щось трапилось...", description: "Будь ласка, спробуйте ще раз" });
      }
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Загальна інформація</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва</FormLabel>
                  <FormControl>
                    <Input className="max-w-md" {...field} />
                  </FormControl>
                  <FormDescription>Наприклад: Спортивний комплекс NorthSport</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="max-w-2xl">
                  <FormLabel>Детальний опис</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" rows={6} {...field} />
                  </FormControl>
                  <FormDescription>
                    Опис майданчика, розміри та характеристики, особливості та унікальні переваги,
                    інформація про доступність послуг, інші важливі деталі
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ціна</FormLabel>
                  <FormControl>
                    <Input className="max-w-[256px]" type="number" {...field} />
                  </FormControl>
                  <FormDescription>₴ за годину</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Додаткова інформація</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="events"
              render={() => (
                <FormItem>
                  <FormLabel className="mb-4 text-base">Види активностей</FormLabel>
                  {COURT_EVENTS.map((event) => (
                    <FormField
                      control={form.control}
                      key={event.value}
                      name="events"
                      render={({ field }) => {
                        return (
                          <FormItem
                            className="flex flex-row items-start space-x-3 space-y-0"
                            key={event.value}>
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(event.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, event.value]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((value) => value !== event.value),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{event.label}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Фото</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Завантажте до 5 фотографій, що демонструють спортивний зал. Перше фото буде на
                    обкладинці оголошення
                  </FormDescription>
                  <FormControl>
                    <Dropzone
                      disabled={field.value.length === 5}
                      maxFiles={5 - field.value.length}
                      onChange={(files) => {
                        field.onChange(files);
                        form.clearErrors("photos");
                      }}
                      onError={(errors) => {
                        form.setError("photos", { message: errors[0] });
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Місцезнаходження</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <GooglePlacesAutocomplete
                      className="max-w-2xl"
                      disabled
                      label="Місто"
                      onChange={async (suggestion) => {
                        field.onChange(suggestion);

                        const geocode = await getGeocode({ address: suggestion.description });
                        const { lat, lng } = getLatLng(geocode[0]);

                        form.setValue("location", { lat, lng });
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {field.value ? (
                      <GoogleMap
                        defaultCenter={field.value}
                        height={500}
                        mode="pick-location"
                        onCenterChange={field.onChange}
                      />
                    ) : null}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ваші контактні дані</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Контактна особа</FormLabel>
                  <FormControl>
                    <Input className="max-w-md" placeholder="Jon Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="max-w-md" placeholder="jon.doe@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input className="max-w-md" placeholder="+380123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button disabled={form.formState.isSubmitting} type="submit">
          {court ? "Зберігти зміни" : "Опубліковати майданчик"}
        </Button>
      </form>
    </Form>
  );
}
