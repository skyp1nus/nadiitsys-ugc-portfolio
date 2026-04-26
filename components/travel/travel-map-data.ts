export interface Pin {
  x: number;
  y: number;
  label: string;
}

export const PINS: ReadonlyArray<Pin> = [
  { x: 29.44, y: 27.38, label: "NYC" },
  { x: 47.78, y: 32.43, label: "Marrakech" },
  { x: 49.97, y: 21.39, label: "London" },
  { x: 50.65, y: 22.86, label: "Paris" },
  { x: 53.47, y: 26.72, label: "Rome" },
  { x: 54.06, y: 27.43, label: "Positano" },
  { x: 57.05, y: 29.74, label: "Santorini" },
  { x: 58.48, y: 21.97, label: "Kyiv" },
  { x: 60.53, y: 35.22, label: "AlUla" },
  { x: 65.35, y: 36.0, label: "Dubai" },
  { x: 88.8, y: 30.18, label: "Tokyo" },
  { x: 81.97, y: 54.63, label: "Bali" },
];

export const COUNTRIES: ReadonlyArray<string> = [
  "Poland",
  "Italy",
  "Spain",
  "Germany",
  "Hungary",
  "Czechia",
  "Slovakia",
  "Portugal",
  "Albania",
  "Austria",
  "Canada",
  "Cyprus",
  "UAE",
  "Vatican",
  "Greece",
  "Ukraine",
  "France",
];

export const STATS = {
  countries: 17,
  cities: 71,
  continents: 3,
} as const;
