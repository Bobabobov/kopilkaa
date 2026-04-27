export interface DinoBiome {
  id: "day" | "sunset" | "night";
  name: string;
  skyTop: [number, number, number];
  skyBottom: [number, number, number];
  celestial: string;
  mountain: string;
  cloud: string;
}

export const DINO_BIOMES: DinoBiome[] = [
  {
    id: "day",
    name: "День",
    skyTop: [70, 140, 220],
    skyBottom: [20, 70, 140],
    celestial: "rgba(255,241,180,0.38)",
    mountain: "rgba(35,48,74,0.6)",
    cloud: "rgba(255,255,255,0.2)",
  },
  {
    id: "sunset",
    name: "Закат",
    skyTop: [180, 90, 120],
    skyBottom: [70, 40, 80],
    celestial: "rgba(255,200,130,0.32)",
    mountain: "rgba(54,30,64,0.65)",
    cloud: "rgba(255,215,195,0.18)",
  },
  {
    id: "night",
    name: "Ночь",
    skyTop: [30, 52, 90],
    skyBottom: [10, 18, 40],
    celestial: "rgba(220,230,255,0.24)",
    mountain: "rgba(17,24,40,0.72)",
    cloud: "rgba(235,244,255,0.14)",
  },
];

export type DinoBiomeId = DinoBiome["id"];

export function getBiomeById(id: DinoBiomeId): DinoBiome {
  return DINO_BIOMES.find((biome) => biome.id === id) ?? DINO_BIOMES[0];
}

