import { type ReactNode, useMemo } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Props {
  mode?: "default" | "pick-location";
  defaultCenter: Coordinates;
  onCenterChange?: (coordinates: Coordinates) => void;
  height: number;
  children?: ReactNode;
}

export function GoogleMap({
  defaultCenter,
  onCenterChange,
  height,
  children,
  mode = "default",
}: Props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _defaultCenter = useMemo(() => defaultCenter, []);

  return (
    <div className="relative overflow-hidden rounded-md" style={{ height, width: "100%" }}>
      {mode === "pick-location" && (
        <div className="absolute left-1/2 top-1/2 z-50">
          <div className="transform-all -ml-[15px] -mt-[35px] h-[30px] w-[30px] -rotate-45 rounded-[50%_50%_50%_0] border border-white bg-red-400" />
        </div>
      )}

      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <Map
          defaultCenter={_defaultCenter}
          defaultZoom={14}
          fullscreenControl={false}
          mapTypeControl={false}
          onDragend={(event) => {
            onCenterChange?.({
              lat: event.map.getCenter()?.lat() || 0,
              lng: event.map.getCenter()?.lng() || 0,
            });
          }}
          streetViewControl={false}>
          {children}
        </Map>
      </APIProvider>
    </div>
  );
}

export const GoogleMapMarker = Marker;
