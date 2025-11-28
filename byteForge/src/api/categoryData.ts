export type CategoryKey =
  | "GFuel"
  | "Peripherals"
  | "Cases"
  | "Components"
  | "Phones"
  | "Games"
  | "Accessories"
  | "Bundles";

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  GFuel: "G Fuel",
  Peripherals: "Peripherals",
  Components: "Components",
  Cases: "Cases",
  Phones: "Phones",
  Games: "Games",
  Accessories: "Accessories",
  Bundles: "Bundles",
};

// Map UI categories to database categories
export const CATEGORY_TO_DB: Record<CategoryKey, string> = {
  GFuel: "g-fuel",
  Peripherals: "peripherals",
  Components: "components",
  Cases: "cases",
  Phones: "phones",
  Games: "games",
  Accessories: "accessories",
  Bundles: "bundles",
};

export const CATEGORY_ITEMS: Record<CategoryKey, string[]> = {
  GFuel: ["Energy Tubs", "Shaker Cups", "Starter Packs"],
  Peripherals: ["Keyboards", "Mice", "Headsets", "Mousepads"],
  Components: ["CPUs", "GPUs", "RAM", "Storage"],
  Cases: ["ATX Cases", "mATX Cases", "Mini-ITX Cases"],
  Phones: ["Android Phones", "iPhones", "Gaming Phones"],
  Games: ["PC Games", "Console Games", "Gift Cards"],
  Accessories: ["Monitor Lights", "USB Hubs", "Cables", "Mounts"],
  Bundles: ["Keyboard + Mouse Bundle", "Streaming Starter Kit"],
};
