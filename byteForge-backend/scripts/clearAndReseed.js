import db from "../db.js";

const products = [
  // G Fuel
  {
    name: "GFUEL Blue Ice Tub",
    description: "40 servings of sugar-free gaming energy formula",
    price: 35.99,
    category: "g-fuel",
    image: "gfuel_blue_ice.png",
  },
  {
    name: "GFUEL Hype Sauce",
    description: "Raspberry lemonade energy drink mix",
    price: 35.99,
    category: "g-fuel",
    image: "gfuel_hype_sauce.png",
  },
  {
    name: "GFUEL PewDiePie Shaker",
    description: "Limited edition shaker cup with branded design",
    price: 12.99,
    category: "g-fuel",
    image: "gfuel_pewdiepie_shaker.png",
  },
  {
    name: "GFUEL Starter Kit",
    description: "Variety pack with 7 flavor sachets",
    price: 14.99,
    category: "g-fuel",
    image: "gfuel_starter_kit.png",
  },
  {
    name: "GFUEL Hydration Formula",
    description: "Sugar-free hydration drink mix",
    price: 29.99,
    category: "g-fuel",
    image: "gfuel_hydration.png",
  },

  // Peripherals
  {
    name: "Logitech G Pro X Superlight",
    description: "Ultra-lightweight wireless gaming mouse",
    price: 149.99,
    category: "peripherals",
    image: "logitech_g_pro_superlight.png",
  },
  {
    name: "Razer BlackWidow V4 Pro",
    description: "Mechanical gaming keyboard with RGB lighting",
    price: 229.99,
    category: "peripherals",
    image: "razer_blackwidow_v4.png",
  },
  {
    name: "SteelSeries Arctis Nova Pro",
    description: "Premium wireless gaming headset with ANC",
    price: 349.99,
    category: "peripherals",
    image: "steelseries_arctis_nova.png",
  },
  {
    name: "HyperX Cloud II",
    description: "Gaming headset with 7.1 virtual surround sound",
    price: 99.99,
    category: "peripherals",
    image: "hyperx_cloud_ii.png",
  },
  {
    name: "Corsair K70 RGB",
    description: "Mechanical gaming keyboard with Cherry MX switches",
    price: 179.99,
    category: "peripherals",
    image: "corsair_k70_rgb.png",
  },
  {
    name: "Razer DeathAdder V3",
    description: "Ergonomic wireless gaming mouse",
    price: 89.99,
    category: "peripherals",
    image: "razer_deathadder_v3.png",
  },

  // Components
  {
    name: "NVIDIA RTX 4080",
    description: "High-performance graphics card for gaming",
    price: 1199.0,
    category: "components",
    image: "nvidia_rtx_4080.png",
  },
  {
    name: "AMD Ryzen 9 7950X",
    description: "16-core desktop processor",
    price: 699.0,
    category: "components",
    image: "amd_ryzen_9_7950x.png",
  },
  {
    name: "Corsair Vengeance RGB 32GB",
    description: "DDR5 RAM kit with RGB lighting",
    price: 179.99,
    category: "components",
    image: "corsair_vengeance_rgb.png",
  },
  {
    name: "Samsung 980 PRO 2TB",
    description: "PCIe 4.0 NVMe SSD",
    price: 199.99,
    category: "components",
    image: "samsung_980_pro.png",
  },
  {
    name: "ASUS ROG Strix B650",
    description: "ATX motherboard for AMD processors",
    price: 299.99,
    category: "components",
    image: "asus_rog_strix_b650.png",
  },
  {
    name: "Corsair RM850x",
    description: "850W modular power supply",
    price: 139.99,
    category: "components",
    image: "corsair_rm850x.png",
  },
  {
    name: "NZXT Kraken X63",
    description: "280mm RGB liquid CPU cooler",
    price: 149.99,
    category: "components",
    image: "nzxt_kraken_x63.png",
  },

  // Cases
  {
    name: "NZXT H510 Elite",
    description: "Mid-tower case with tempered glass panel",
    price: 149.99,
    category: "cases",
    image: "nzxt_h510_elite.png",
  },
  {
    name: "Corsair 4000D Airflow",
    description: "Mid-tower case with optimized airflow",
    price: 104.99,
    category: "cases",
    image: "corsair_4000d.png",
  },
  {
    name: "Lian Li O11 Dynamic",
    description: "Premium dual-chamber ATX case",
    price: 139.99,
    category: "cases",
    image: "lian_li_o11.png",
  },
  {
    name: "Fractal Design Meshify C",
    description: "Compact mid-tower with mesh front",
    price: 109.99,
    category: "cases",
    image: "fractal_meshify_c.png",
  },
  {
    name: "Cooler Master H500",
    description: "Mid-tower case with dual 200mm RGB fans",
    price: 119.99,
    category: "cases",
    image: "cooler_master_h500.png",
  },

  // Phones
  {
    name: "iPhone 15 Pro",
    description: "6.1-inch smartphone with A17 Pro chip",
    price: 999.0,
    category: "phones",
    image: "iphone_15_pro.png",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "6.8-inch smartphone with S Pen and 200MP camera",
    price: 1199.0,
    category: "phones",
    image: "samsung_s24_ultra.png",
  },
  {
    name: "Google Pixel 8 Pro",
    description: "6.7-inch smartphone with AI features",
    price: 899.0,
    category: "phones",
    image: "google_pixel_8_pro.png",
  },
  {
    name: "OnePlus 12",
    description: "6.82-inch flagship with Snapdragon 8 Gen 3",
    price: 799.0,
    category: "phones",
    image: "oneplus_12.png",
  },
  {
    name: "iPhone 15",
    description: "6.1-inch smartphone with A16 Bionic chip",
    price: 799.0,
    category: "phones",
    image: "iphone_15.png",
  },
  {
    name: "Samsung Galaxy Z Flip 5",
    description: "Foldable smartphone with compact design",
    price: 999.0,
    category: "phones",
    image: "samsung_z_flip_5.png",
  },

  // Games
  {
    name: "Elden Ring",
    description: "Action RPG from FromSoftware",
    price: 59.99,
    category: "games",
    image: "elden_ring.png",
  },
  {
    name: "Baldur's Gate 3",
    description: "Epic RPG based on D&D",
    price: 59.99,
    category: "games",
    image: "baldurs_gate_3.png",
  },
  {
    name: "Cyberpunk 2077",
    description: "Open-world action RPG",
    price: 39.99,
    category: "games",
    image: "cyberpunk_2077.png",
  },
  {
    name: "Red Dead Redemption 2",
    description: "Western action-adventure game",
    price: 49.99,
    category: "games",
    image: "rdr2.png",
  },
  {
    name: "The Witcher 3",
    description: "Award-winning fantasy RPG",
    price: 29.99,
    category: "games",
    image: "witcher_3.png",
  },
  {
    name: "God of War Ragnarök",
    description: "Norse mythology action game",
    price: 59.99,
    category: "games",
    image: "god_of_war_ragnarok.png",
  },
  {
    name: "Hogwarts Legacy",
    description: "Open-world Harry Potter RPG",
    price: 59.99,
    category: "games",
    image: "hogwarts_legacy.png",
  },

  // Accessories
  {
    name: "Gaming Mouse Pad XXL",
    description: "Extended RGB mouse pad 35x15 inches",
    price: 34.99,
    category: "accessories",
    image: "mousepad_xxl.png",
  },
  {
    name: "Controller Charging Station",
    description: "Dual charger dock for PS5/Xbox controllers",
    price: 29.99,
    category: "accessories",
    image: "controller_charger.png",
  },
  {
    name: "Cable Management Kit",
    description: "Neoprene cable organizer set",
    price: 19.99,
    category: "accessories",
    image: "cable_management.png",
  },
  {
    name: "Webcam 1080p HD",
    description: "USB webcam with auto focus",
    price: 69.99,
    category: "accessories",
    image: "webcam_1080p.png",
  },
  {
    name: "Blue Yeti Microphone",
    description: "Professional USB microphone",
    price: 129.99,
    category: "accessories",
    image: "blue_yeti.png",
  },
  {
    name: "Elgato Stream Deck",
    description: "15-key LCD customizable control pad",
    price: 149.99,
    category: "accessories",
    image: "elgato_stream_deck.png",
  },
  {
    name: "Ring Light Kit",
    description: "18-inch dimmable LED ring light",
    price: 89.99,
    category: "accessories",
    image: "ring_light.png",
  },
  {
    name: "Laptop Stand Aluminum",
    description: "Ergonomic laptop stand",
    price: 39.99,
    category: "accessories",
    image: "laptop_stand.png",
  },

  // Bundles
  {
    name: "Gaming Starter Bundle",
    description: "Mouse, keyboard, and headset combo",
    price: 199.99,
    category: "bundles",
    image: "bundle_gaming_starter.png",
  },
  {
    name: "Streaming Setup Bundle",
    description: "Webcam, microphone, and ring light package",
    price: 329.99,
    category: "bundles",
    image: "bundle_streaming.png",
  },
  {
    name: "RGB Gaming Bundle",
    description: "RGB mouse, keyboard, mousepad, and headset",
    price: 249.99,
    category: "bundles",
    image: "bundle_rgb_gaming.png",
  },
  {
    name: "Content Creator Bundle",
    description: "Stream Deck, webcam, and microphone",
    price: 399.99,
    category: "bundles",
    image: "bundle_content_creator.png",
  },
  {
    name: "Complete PC Build Bundle",
    description: "All components for a gaming PC build",
    price: 1899.0,
    category: "bundles",
    image: "bundle_pc_build.png",
  },
];

async function clearAndReseed() {
  try {
    console.log("Clearing existing products...");
    await db.query("DELETE FROM products");
    console.log("✓ Products table cleared");

    console.log("\nStarting to seed products with categories...");

    for (const product of products) {
      await db.query(
        "INSERT INTO products (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)",
        [
          product.name,
          product.description,
          product.price,
          product.image || null,
          product.category || null,
        ]
      );
      console.log(`✓ Added: ${product.name} (${product.category})`);
    }

    console.log(
      `\n✅ Successfully seeded ${products.length} products with categories!`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

clearAndReseed();
