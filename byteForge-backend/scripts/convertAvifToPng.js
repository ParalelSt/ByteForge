import sharp from "sharp";

const inputPath = "images/product_images/Logitech_G502.avif";
const outputPath = "images/product_images/Logitech_G502_converted.png";

async function convertToPng() {
  try {
    await sharp(inputPath).png().toFile(outputPath);

    console.log(`✔ Converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error("✖ Conversion failed:", error.message);
  }
}

convertToPng();
