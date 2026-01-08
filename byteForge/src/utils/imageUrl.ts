// Helper function to get proper image URL
export const getImageUrl = (
  imageUrl: string | null | undefined,
  imageName: string | null | undefined,
  imageType: "product" | "promo" = "product"
): string => {
  if (imageUrl && imageUrl.startsWith("http")) {
    return imageUrl;
  }

  if (imageName) {
    const filename = imageName.replace(/^.*[\\/]/, "");
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/${imageType}_images/${imageType}_images/${filename}`;
    }
  }

  return "/placeholder.png";
};
