import db from "./db.js";

const [products] = await db.query('SELECT id, name, image FROM products ORDER BY id LIMIT 15');
products.forEach(p => console.log(`${p.id}: ${p.name} → ${p.image}`));

process.exit(0);
