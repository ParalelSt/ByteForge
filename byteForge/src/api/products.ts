export async function fetchProducts() {
  const response = await fetch("http://192.168.1.105:3000/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}
