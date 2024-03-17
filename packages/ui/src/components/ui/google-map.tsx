import { type ReactNode, useMemo } from "react";
import GoogleMapReact from "google-map-react";

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
    <div className="relative" style={{ height, width: "100%" }}>
      {mode === "pick-location" && (
        <div className="absolute left-1/2 top-1/2 z-50">
          <Pin />
        </div>
      )}

      <div style={{ height, width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" }}
          defaultCenter={_defaultCenter}
          defaultZoom={12}
          onDragEnd={(map: { center: { lat: () => number; lng: () => number } }) => {
            onCenterChange?.({ lat: map.center.lat(), lng: map.center.lng() });
          }}
          options={{ fullscreenControl: false }}>
          {children}
        </GoogleMapReact>
      </div>
    </div>
  );
}

function Pin() {
  return (
    <div className="transform-all -ml-[15px] -mt-[35px] h-[30px] w-[30px] -rotate-45 rounded-[50%_50%_50%_0] border border-white bg-red-400" />
  );
}
