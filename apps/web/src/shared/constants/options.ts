import { CourtEvent } from "@maidanchyk/prisma";

export const COURT_EVENTS = [
  { label: "Badminton", value: CourtEvent.BADMINTON },
  { label: "Basketball", value: CourtEvent.BASKETBALL },
  { label: "Handball", value: CourtEvent.HANDBALL },
  { label: "Mini Football", value: CourtEvent.MINI_FOOTBALL },
  { label: "Multi-Sport", value: CourtEvent.MULTI_SPORT },
  { label: "Tennis", value: CourtEvent.TENNIS },
  { label: "Volleyball", value: CourtEvent.VOLLEYBALL },
];
