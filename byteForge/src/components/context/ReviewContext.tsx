import React, { createContext, useContext, useState } from "react";

export interface Review {
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
}

interface ReviewContextType {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchReviews: (productId: number | string) => Promise<void>;
  addReview: (
    productId: number,
    userId: number,
    rating: number,
    title: string,
    text: string
  ) => Promise<void>;
  updateHelpful: (reviewId: number) => Promise<void>;
  deleteReview: (reviewId: number, userId: number) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (productId: number | string) => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/products/${productId}/reviews`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError((err as Error).message);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (
    productId: number,
    userId: number,
    rating: number,
    title: string,
    text: string
  ) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          user_id: userId,
          rating,
          title,
          text,
        }),
      });
      if (!response.ok) throw new Error("Failed to add review");
      const newReview = await response.json();
      setReviews([newReview, ...reviews]);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const updateHelpful = async (reviewId: number) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/reviews/${reviewId}/helpful`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Failed to update helpful count");
      setReviews(
        reviews.map((r) =>
          r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r
        )
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const deleteReview = async (reviewId: number, userId: number) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) throw new Error("Failed to delete review");
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        loading,
        error,
        fetchReviews,
        addReview,
        updateHelpful,
        deleteReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviews must be used within ReviewProvider");
  }
  return context;
};
