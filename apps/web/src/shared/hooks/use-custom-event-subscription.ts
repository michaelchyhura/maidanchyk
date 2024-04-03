import { useEffect } from "react";

export const useCustomEventSubscription = (type: string, callback: () => void) => {
  useEffect(() => {
    const listener = () => callback();

    document.addEventListener(type, listener);

    return () => {
      document.removeEventListener(type, listener);
    };
  }, [type, callback]);
};

export function emit(type: string) {
  const event = new CustomEvent(type);

  document.dispatchEvent(event);
}
