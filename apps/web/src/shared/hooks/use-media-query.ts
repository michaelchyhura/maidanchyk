import { useEffect, useState } from "react";

type Dimension = "width" | "height";

export const useMediaQuery = (size: number, dimension: Dimension = "width") => {
  const [targetReached, setTargetReached] = useState(false);

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => setTargetReached(event.matches);

    const media = window.matchMedia(`(min-${dimension}: ${size}px)`);

    if (media.matches) {
      setTargetReached(media.matches);
    }

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, [size, dimension]);

  return targetReached;
};
