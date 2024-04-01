import { Combobox } from "@headlessui/react";
import { cn } from "@maidanchyk/ui";
import { CheckIcon } from "lucide-react";
import usePlacesAutocomplete from "use-places-autocomplete";

type GooglePlace = {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
};

type Props = {
  className?: string;
  label?: string;
  value: GooglePlace | null;
  onChange: (suggestion: google.maps.places.AutocompletePrediction) => void;
  disabled?: boolean;
};

// TODO: Wrap into `forwardRef` and add support for error state
export const GooglePlacesAutocomplete = ({
  className,
  label,
  value,
  onChange,
  disabled,
}: Props) => {
  const {
    // ready,
    suggestions: { data },
    setValue: setQuery,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleChange = (suggestion: google.maps.places.AutocompletePrediction) => {
    setQuery(suggestion.structured_formatting.main_text, false);
    clearSuggestions();
    onChange(suggestion);
  };

  return (
    <Combobox
      as="div"
      className={cn("grid gap-y-2", className)}
      onChange={handleChange}
      value={value}
      disabled={disabled}>
      <Combobox.Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </Combobox.Label>
      <div className="relative">
        <Combobox.Input
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
          displayValue={(place: google.maps.places.AutocompletePrediction | null) =>
            place?.structured_formatting.main_text || ""
          }
          onChange={(event) => setQuery(event.target.value)}
        />

        {data.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {data.map((suggestion) => (
              <Combobox.Option
                className={({ active }) =>
                  cn(
                    "relative mx-1 cursor-default select-none rounded-md px-4 py-2",
                    active ? "bg-zinc-100" : "text-gray-900",
                  )
                }
                key={suggestion.place_id}
                value={suggestion}>
                {() => (
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "truncate",
                          suggestion.place_id === value?.place_id && "font-semibold",
                        )}>
                        {suggestion.structured_formatting.main_text}
                      </span>
                      <span className="truncate text-sm text-gray-500">
                        {suggestion.structured_formatting.secondary_text}
                      </span>
                    </div>

                    {suggestion.place_id === value?.place_id && (
                      <CheckIcon aria-hidden="true" className="h-5 w-5 text-zinc-600" />
                    )}
                  </div>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};
