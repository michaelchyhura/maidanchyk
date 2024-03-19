import { CourtEvent } from "@maidanchyk/prisma";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@maidanchyk/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GooglePlacesAutocomplete } from "../google-places-autocomplete";
import { IVANO_FRANKIVSK_CITY } from "../../shared/constants/google-places";
import { COURT_EVENTS } from "../../shared/constants/options";

const ORDER_BY_OPTIONS = [
  { label: "Recent", value: "recent" },
  { label: "Cheapest", value: "cheapest" },
  { label: "Most Expensive", value: "expensive" },
];

export const CourtsFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const sort = searchParams.get("sort")?.toString() || "recent";
  const events = searchParams.get("events")?.toString().split(",");

  const handleOrderChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    params.set("page", "1");

    replace([pathname, params.toString()].filter(Boolean).join("?"));
  };

  const handleEventsChange = (event: CourtEvent) => {
    const params = new URLSearchParams(searchParams);

    let courtEvents = events || [];

    if (courtEvents.includes(event)) {
      courtEvents = courtEvents.filter((e) => e !== event);
    } else {
      courtEvents.push(event);
    }

    if (courtEvents.length) {
      params.set("events", courtEvents.toSorted().toString());
    } else {
      params.delete("events");
    }

    params.set("page", "1");

    replace([pathname, params.toString()].filter(Boolean).join("?"));
  };

  return (
    <>
      <Select defaultValue={sort} onValueChange={handleOrderChange}>
        <SelectTrigger>
          <SelectValue placeholder="Order by" />
        </SelectTrigger>
        <SelectContent>
          {ORDER_BY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <GooglePlacesAutocomplete value={IVANO_FRANKIVSK_CITY} onChange={() => {}} />

      <ul className="flex flex-wrap gap-2">
        {COURT_EVENTS.map((event) => (
          <li key={event.value}>
            <Button
              size="sm"
              variant={events?.includes(event.value) ? "default" : "secondary"}
              onClick={() => handleEventsChange(event.value)}>
              {event.label}
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};
