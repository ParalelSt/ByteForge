export async function fetchProducts() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}
