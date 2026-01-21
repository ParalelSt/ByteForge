import { useEffect, useState } from "react";
import { useUser } from "@/components/context/UserContext";
import { FaStar, FaThumbsUp } from "react-icons/fa6";
import "@/styles/product/productReviews.scss";

/**
 * Product reviews section
 * Displays customer reviews, ratings, and allows authenticated users to post new reviews
 */

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title: string;
  text: string;
  helpful_count: number;
  created_at: string;
  username: string;
  profile_image?: string;
  user_marked_helpful?: number;
}

interface ProductReviewsProps {
  productId: number | string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useUser();

  // Review data and UI state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<number>>(new Set());
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingReviewId, setUpdatingReviewId] = useState<number | null>(null);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    title: "",
    text: "",
  });

  // Fetch reviews for product on mount or when productId changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        const url = new URL(`${apiUrl}/products/${productId}/reviews`);
        if (user?.id) {
          url.searchParams.append("userId", user.id.toString());
        }
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setReviews(data);
        // Populate helpfulReviews set from server data
        const markedReviewIds = data
          .filter(
            (r: Review & { user_marked_helpful: number }) =>
              r.user_marked_helpful === 1,
          )
          .map((r: Review) => r.id);
        const markedReviews = new Set<number>(markedReviewIds);
        setHelpfulReviews(markedReviews);
        if (user) {
          const existingUserReview = data.find(
            (r: Review) => r.user_id === Number(user.id),
          );
          setUserReview(existingUserReview || null);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (productId) fetchReviews();
  }, [productId, user?.id]);

  // Submit new review or update existing review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to leave a review");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: Number(productId),
          user_id: user.id,
          rating: reviewFormData.rating,
          title: reviewFormData.title,
          text: reviewFormData.text,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");
      const newReview = await response.json();
      setReviews([newReview, ...reviews]);
      setReviewFormData({ rating: 5, title: "", text: "" });
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  const handleUpdateHelpful = async (reviewId: number) => {
    // Prevent multiple simultaneous requests
    if (updatingReviewId === reviewId) return;
    if (!user) {
      alert("Please log in to mark reviews as helpful");
      return;
    }

    const isMarked = helpfulReviews.has(reviewId);
    setUpdatingReviewId(reviewId);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/reviews/${reviewId}/helpful`, {
        method: "PATCH",
        body: JSON.stringify({ userId: user.id }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update helpful count");

      if (isMarked) {
        // Remove like
        setHelpfulReviews((prev) => {
          const newSet = new Set(prev);
          newSet.delete(reviewId);
          return newSet;
        });
        setReviews(
          reviews.map((r) =>
            r.id === reviewId
              ? { ...r, helpful_count: r.helpful_count - 1 }
              : r,
          ),
        );
      } else {
        // Add like
        setHelpfulReviews((prev) => new Set(prev).add(reviewId));
        setReviews(
          reviews.map((r) =>
            r.id === reviewId
              ? { ...r, helpful_count: r.helpful_count + 1 }
              : r,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating helpful count:", error);
    } finally {
      setUpdatingReviewId(null);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <div className="product-reviews">
      <div className="review-top">
        <div className="review-top-left">
          <h2>REVIEWS</h2>

          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                fill={star <= Math.round(averageRating) ? "gold" : "lightgray"}
              />
            ))}
          </div>

          <div className="review-count">{reviews.length} Reviews</div>

          <div className="page-selector">
            {showAllReviews && reviews.length > 2 && (
              <button
                className="show-less-btn"
                onClick={() => setShowAllReviews(false)}
              >
                Show Less
              </button>
            )}
          </div>
        </div>

        <div className="review-top-right">
          <button
            className="write-a-review"
            onClick={() => {
              if (!user) {
                alert("Please log in to leave a review");
                return;
              }
              if (userReview && !showReviewForm) {
                setShowEditModal(true);
              } else {
                setShowReviewForm(!showReviewForm);
              }
            }}
          >
            {showReviewForm ? "CANCEL" : "WRITE A REVIEW"}
          </button>
        </div>
      </div>

      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <div className="form-group">
            <label>Rating</label>
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${
                    star <= reviewFormData.rating ? "filled" : ""
                  }`}
                  onClick={() =>
                    setReviewFormData({ ...reviewFormData, rating: star })
                  }
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Summary of your review"
              value={reviewFormData.title}
              onChange={(e) =>
                setReviewFormData({
                  ...reviewFormData,
                  title: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Review</label>
            <textarea
              placeholder="Share your experience with this product..."
              value={reviewFormData.text}
              onChange={(e) =>
                setReviewFormData({ ...reviewFormData, text: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            SUBMIT REVIEW
          </button>
        </form>
      )}

      <div className="review-bottom">
        {reviewsLoading ? (
          <p className="loading-text">Loading reviews...</p>
        ) : displayedReviews.length > 0 ? (
          displayedReviews.map((review) => (
            <div key={review.id} className="review-container">
              <div className="review-container-top">
                <div className="review-container-top-left">
                  <div className="reviewer-avatar">
                    {review.username && review.username.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="review-container-top-right">
                  <div className="top">
                    <span className="name">{review.username}</span>
                    <span className="time">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="bottom">
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          fill={star <= review.rating ? "gold" : "lightgray"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="review-container-bottom">
                <h2>{review.title}</h2>
                <p>{review.text}</p>

                <div className="like-report-container">
                  <span>Helpful</span>
                  <button
                    className={`like-container ${
                      helpfulReviews.has(review.id) ? "marked" : ""
                    }`}
                    onClick={() => handleUpdateHelpful(review.id)}
                  >
                    <FaThumbsUp /> ({review.helpful_count})
                  </button>
                  <div className="report-container"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-reviews-text">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>

      {reviews.length > 2 && !showAllReviews && (
        <button
          className="see-all-reviews-btn"
          onClick={() => setShowAllReviews(true)}
        >
          SEE ALL REVIEWS
        </button>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>You already have a review for this product</h3>
            <p>
              Would you like to edit your existing review or write a new one?
            </p>
            <div className="modal-buttons">
              <button
                className="modal-btn modal-btn-primary"
                onClick={() => {
                  setShowEditModal(false);
                  setShowReviewForm(true);
                }}
              >
                WRITE NEW REVIEW
              </button>
              <button
                className="modal-btn modal-btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
