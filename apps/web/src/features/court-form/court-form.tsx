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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/router";
import { courtSchema } from "./lib/validation";
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

export const CourtForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const { mutateAsync: createCourt } = trpc.courts.create.useMutation();

  const form = useForm<z.infer<typeof courtSchema>>({
    resolver: zodResolver(courtSchema),
    defaultValues: {
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
    try {
      const photos = await Promise.all(
        values.photos.map(async (file) => {
          return upload(file.name, await compress(file), {
            access: "public",
            handleUploadUrl: "/api/blob/upload",
          });
        }),
      );
      const court = await createCourt({ ...values, photos });

      toast({ title: "Court successfully created" });
      router.push(`/courts/${court.id}`);
    } catch (error) {
      toast({ title: "Something went wrong", description: "Please try again" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="max-w-md"
                      placeholder="NorthSport Athletic Facility"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="max-w-2xl resize-none"
                      placeholder="There are four courts available, that can be converted into 2 pro-sized courts..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input className="max-w-[256px]" type="number" {...field} />
                  </FormControl>
                  <FormDescription>₴, per hour</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="events"
              render={() => (
                <FormItem>
                  <FormLabel className="mb-4 text-base">Supported Events</FormLabel>
                  {COURT_EVENTS.map((event) => (
                    <FormField
                      key={event.value}
                      control={form.control}
                      name="events"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={event.value}
                            className="flex flex-row items-start space-x-3 space-y-0">
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
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Upload up to 5 photos showcasing the gym</FormDescription>
                  <FormControl>
                    <Dropzone
                      value={field.value}
                      onChange={(files) => {
                        field.onChange(files);
                        form.clearErrors("photos");
                      }}
                      onError={(errors) => {
                        form.setError("photos", { message: errors[0] });
                      }}
                      maxFiles={5 - field.value.length}
                      disabled={field.value.length === 5}
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
            <CardTitle>Location</CardTitle>
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
                      label="Select City"
                      value={field.value}
                      onChange={async (suggestion) => {
                        field.onChange(suggestion);

                        const geocode = await getGeocode({ address: suggestion.description });
                        const { lat, lng } = getLatLng(geocode[0]);

                        form.setValue("location", { lat, lng });
                      }}
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
                    {field.value && (
                      <GoogleMap
                        mode="pick-location"
                        defaultCenter={field.value}
                        onCenterChange={field.onChange}
                        height={500}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
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
                    <Input
                      className="max-w-md"
                      placeholder="jon.doe@gmail.com"
                      disabled
                      {...field}
                    />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input className="max-w-md" placeholder="+380123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Publish
        </Button>
      </form>
    </Form>
  );
};
