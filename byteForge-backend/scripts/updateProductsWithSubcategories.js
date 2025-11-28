import db from "../db.js";

// Map product names to their subcategories
const productSubcategories = {
  // G Fuel products
  "GFUEL Blue Ice Tub": "Energy Tubs",
  "GFUEL Hype Sauce": "Energy Tubs",
  "GFUEL PewDiePie Shaker": "Shaker Cups",
  "GFUEL Starter Kit": "Starter Packs",
  "GFUEL Hydration Formula": "Energy Tubs",

  // Peripherals
  "Logitech G Pro X Superlight": "Mice",
  "Razer BlackWidow V4 Pro": "Keyboards",
  "SteelSeries Arctis Nova Pro": "Headsets",
  "HyperX Cloud II": "Headsets",
  "Corsair K70 RGB": "Keyboards",
  "Razer DeathAdder V3": "Mice",

  // Components
  "NVIDIA RTX 4080": "GPUs",
  "AMD Ryzen 9 7950X": "CPUs",
  "Corsair Vengeance RGB 32GB": "RAM",
  "Samsung 980 PRO 2TB": "Storage",
  "ASUS ROG Strix B650": "Motherboards",
  "Corsair RM850x": "Power Supplies",
  "NZXT Kraken X63": "Cooling",

  // Cases
  "NZXT H510 Elite": "ATX Cases",
  "Corsair 4000D Airflow": "ATX Cases",
  "Lian Li O11 Dynamic": "ATX Cases",
  "Fractal Design Meshify C": "mATX Cases",
  "Cooler Master H500": "ATX Cases",

  // Phones
  "iPhone 15 Pro": "iPhones",
  "Samsung Galaxy S24 Ultra": "Android Phones",
  "Google Pixel 8 Pro": "Android Phones",
  "OnePlus 12": "Android Phones",
  "iPhone 15": "iPhones",
  "Samsung Galaxy Z Flip 5": "Foldable Phones",

  // Games
  "Elden Ring": "PC Games",
  "Baldur's Gate 3": "PC Games",
  "Cyberpunk 2077": "PC Games",
  "Red Dead Redemption 2": "Console Games",
  "The Witcher 3": "PC Games",
  "God of War Ragnarök": "Console Games",
  "Hogwarts Legacy": "PC Games",

  // Accessories
  "Gaming Mouse Pad XXL": "Mousepads",
  "Controller Charging Station": "Charging Docks",
  "Cable Management Kit": "Cable Management",
  "Webcam 1080p HD": "Webcams",
  "Blue Yeti Microphone": "Microphones",
  "Elgato Stream Deck": "Stream Equipment",
  "Ring Light Kit": "Lighting",
  "Laptop Stand Aluminum": "Stands",

  // Bundles
  "Gaming Starter Bundle": "Peripheral Bundles",
  "Streaming Setup Bundle": "Streaming Bundles",
  "RGB Gaming Bundle": "Peripheral Bundles",
  "Content Creator Bundle": "Streaming Bundles",
  "Complete PC Build Bundle": "PC Build Bundles",
};

async function updateSubcategories() {
  try {
    console.log(
      "Updating products with subcategories and image extensions...\n"
    );

    // Update image extensions to .jpg
    await db.query(
      "UPDATE products SET image = REPLACE(image, '.png', '.jpg')"
    );
    console.log("✓ Updated all image extensions to .jpg\n");

    for (const [productName, subcategory] of Object.entries(
      productSubcategories
    )) {
      await db.query("UPDATE products SET subcategory = ? WHERE name = ?", [
        subcategory,
        productName,
      ]);
      console.log(`✓ Updated: ${productName} → ${subcategory}`);
    }

    console.log(
      `\n✅ Successfully updated ${
        Object.keys(productSubcategories).length
      } products with subcategories!`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

updateSubcategories();
