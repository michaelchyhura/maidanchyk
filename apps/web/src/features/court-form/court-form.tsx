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
} from "@maidanchyk/ui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { courtSchema } from "./lib/validation";
import { useAuth } from "../../shared/providers/auth";
import { Dropzone } from "../dropzone";
import { GooglePlacesAutocomplete } from "../google-places-autocomplete";
import {
  IVANO_FRANKIVSK_CITY,
  IVANO_FRANKIVSK_COORDINATES,
} from "../../shared/constants/google-places";
import { SUPPORTED_EVENT_TYPES } from "../../shared/constants/options";

export const CourtForm = () => {
  const { user } = useAuth();

  const form = useForm<z.infer<typeof courtSchema>>({
    resolver: zodResolver(courtSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      supportedEventTypes: [],
      photos: [],
      city: IVANO_FRANKIVSK_CITY,
      location: IVANO_FRANKIVSK_COORDINATES,
      contactPerson: user?.name || "",
      contactEmail: user?.email || "",
      contactPhone: user?.phone || "",
    },
  });

  const handleSubmit = (values: z.infer<typeof courtSchema>) => {
    console.log(values);
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
              name="supportedEventTypes"
              render={() => (
                <FormItem>
                  <FormLabel className="mb-4 text-base">Supported Events</FormLabel>
                  {SUPPORTED_EVENT_TYPES.map((eventType) => (
                    <FormField
                      key={eventType.value}
                      control={form.control}
                      name="supportedEventTypes"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={eventType.value}
                            className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(eventType.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, eventType.value]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((value) => value !== eventType.value),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{eventType.label}</FormLabel>
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
                  <FormDescription>Upload up to 5 photos showcasing the gym</FormDescription>
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
