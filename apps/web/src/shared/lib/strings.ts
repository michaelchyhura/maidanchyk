import type { CourtEvent } from "@maidanchyk/prisma";
import { COURT_EVENTS } from "../constants/options";

export const getInitials = (name: string) => {
  const words = name.split(" ");

  let initials = "";

  words.forEach((word) => {
    initials += word.charAt(0).toUpperCase();
  });

  return initials;
};

export const eventTypeToLabel = (event: CourtEvent) =>
  COURT_EVENTS.find((e) => e.value === event)?.label || "";
