import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

// GET all reviews for a product
router.get("/products/:productId/reviews", async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.query;
    console.log(`Fetching reviews for product: ${productId}`);

    // Fetch reviews with user info
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select(
        `
        id,
        product_id,
        user_id,
        rating,
        title,
        text,
        helpful_count,
        created_at,
        users(name, email)
      `
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (reviewsError) throw reviewsError;

    // Check which reviews are marked as helpful by current user
    let userHelpfulReviews = [];
    if (userId) {
      const { data: helpful, error: helpfulError } = await supabase
        .from("review_helpful")
        .select("review_id")
        .eq("user_id", userId);
      if (!helpfulError) {
        userHelpfulReviews = helpful.map((h) => h.review_id);
      }
    }

    // Format response to match MySQL version
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      product_id: review.product_id,
      user_id: review.user_id,
      rating: review.rating,
      title: review.title,
      text: review.text,
      helpful_count: review.helpful_count,
      created_at: review.created_at,
      username: review.users?.name || review.users?.email,
      profile_image: null,
      user_marked_helpful: userHelpfulReviews.includes(review.id) ? 1 : 0,
    }));

    console.log(
      `Found ${formattedReviews.length} reviews for product ${productId}`
    );
    res.json(formattedReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
});

// POST create a new review
router.post("/reviews", async (req, res) => {
  try {
    const { product_id, user_id, rating, title, text } = req.body;

    if (!product_id || !user_id || !rating || !title || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { data: newReview, error } = await supabase
      .from("reviews")
      .insert([{ product_id, user_id, rating, title, text }])
      .select();

    if (error) throw error;

    const review = newReview[0];
    res.status(201).json({
      id: review.id,
      product_id: review.product_id,
      user_id: review.user_id,
      rating: review.rating,
      title: review.title,
      text: review.text,
      helpful_count: review.helpful_count || 0,
      created_at: review.created_at,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Error creating review" });
  }
});

// PATCH update helpful count (toggle add/remove with user tracking)
router.patch("/reviews/:reviewId/helpful", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Check if user already marked this review as helpful
    const { data: existing, error: checkError } = await supabase
      .from("review_helpful")
      .select("id")
      .eq("review_id", reviewId)
      .eq("user_id", userId);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      // User already marked - remove the mark
      const { error: deleteError } = await supabase
        .from("review_helpful")
        .delete()
        .eq("review_id", reviewId)
        .eq("user_id", userId);
      if (deleteError) throw deleteError;

      // Get current helpful_count
      const { data: review, error: getError } = await supabase
        .from("reviews")
        .select("helpful_count")
        .eq("id", reviewId)
        .limit(1);
      if (getError) throw getError;

      const currentCount = review[0]?.helpful_count || 0;
      const { error: updateError } = await supabase
        .from("reviews")
        .update({ helpful_count: Math.max(0, currentCount - 1) })
        .eq("id", reviewId);
      if (updateError) throw updateError;
    } else {
      // User hasn't marked - add the mark
      const { error: insertError } = await supabase
        .from("review_helpful")
        .insert([{ review_id: reviewId, user_id: userId }]);
      if (insertError) throw insertError;

      // Get current helpful_count
      const { data: review, error: getError } = await supabase
        .from("reviews")
        .select("helpful_count")
        .eq("id", reviewId)
        .limit(1);
      if (getError) throw getError;

      const currentCount = review[0]?.helpful_count || 0;
      const { error: updateError } = await supabase
        .from("reviews")
        .update({ helpful_count: currentCount + 1 })
        .eq("id", reviewId);
      if (updateError) throw updateError;
    }

    res.json({ message: "Helpful count updated" });
  } catch (error) {
    console.error("Error updating helpful count:", error);
    res.status(500).json({ message: "Error updating helpful count" });
  }
});

// DELETE a review (only by owner or admin)
router.delete("/reviews/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { user_id } = req.body;

    // Check if user is the review author
    const { data: review, error: getError } = await supabase
      .from("reviews")
      .select("user_id")
      .eq("id", reviewId)
      .limit(1);

    if (getError) throw getError;
    if (!review || review.length === 0 || review[0].user_id !== user_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { error: deleteError } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (deleteError) throw deleteError;

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review" });
  }
});

export default router;
