// Dictionary types live here (NOT in dictionaries.ts which is `server-only`),
// so client components can import the shapes without pulling server code.
import type en from "@/lib/i18n/dictionaries/en.json";

export type Dictionary = typeof en;
export type TravelDict = Dictionary["travel"];
export type HomeDict = Dictionary["home"];
