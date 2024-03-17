import { CourtEventType } from "@maidanchyk/prisma";

export const SUPPORTED_EVENT_TYPES = [
  { label: "Badminton", value: CourtEventType.BADMINTON },
  { label: "Basketball", value: CourtEventType.BASKETBALL },
  { label: "Handball", value: CourtEventType.HANDBALL },
  { label: "Mini Football", value: CourtEventType.MINI_FOOTBALL },
  { label: "Multi-Sport", value: CourtEventType.MULTI_SPORT },
  { label: "Tennis", value: CourtEventType.TENNIS },
  { label: "Volleyball", value: CourtEventType.VOLLEYBALL },
];
