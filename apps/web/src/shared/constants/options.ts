import { CourtEvent } from "@maidanchyk/prisma";

export const COURT_EVENTS = [
  { label: "Бадмінтон", value: CourtEvent.BADMINTON },
  { label: "Баскетбол", value: CourtEvent.BASKETBALL },
  { label: "Гандбол", value: CourtEvent.HANDBALL },
  { label: "Міні-футбол", value: CourtEvent.MINI_FOOTBALL },
  // { label: "Multi-Sport", value: CourtEvent.MULTI_SPORT },
  { label: "Теніс", value: CourtEvent.TENNIS },
  { label: "Волейбол", value: CourtEvent.VOLLEYBALL },
];
