import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { Star, MessageSquare, Plus, Trash2, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

export default function ReviewSection({ productId }) {
  const { currentUser, isAdmin } = useAuth();
  const { reviews, addReview, deleteReview, getProductRating } = useAppContext();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const productReviews = reviews.filter(r => r.productId === productId);
  const ratingData = getProductRating(productId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!comment.trim()) {
      setError("Please write a review comment.");
      return;
    }

    try {
      await addReview({
        productId,
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous User",
        rating,
        comment: comment.trim()
      });
      setComment("");
      setRating(5);
      setSuccess("Your review was posted successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to submit review. Please try again.");
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
      } catch (err) {
        console.error(err);
        alert("Failed to delete review.");
      }
    }
  };

  // Star bars calculation helper
  const getRatingBarPercentage = (stars) => {
    if (productReviews.length === 0) return 0;
    const count = productReviews.filter(r => r.rating === stars).length;
    return (count / productReviews.length) * 100;
  };

  return (
    <div className="space-y-10">
      {/* Header and Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-t border-light-border dark:border-dark-border pt-10">
        
        {/* Column 1: Rating summary */}
        <div className="md:col-span-4 text-center p-6 rounded-2xl glass-card border border-light-border dark:border-dark-border/40">
          <p className="text-sm font-bold text-light-muted dark:text-dark-muted uppercase tracking-widest mb-1">Average Rating</p>
          <p className="text-6xl font-black text-light-text dark:text-white">{ratingData.avg}</p>
          <div className="flex justify-center space-x-1 my-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(ratingData.avg)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 dark:text-zinc-700"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-light-muted dark:text-dark-muted font-semibold">
            Based on {ratingData.count} review{ratingData.count !== 1 && "s"}
          </p>
        </div>

        {/* Column 2: Rating Bar charts */}
        <div className="md:col-span-8 space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center text-sm">
              <span className="w-12 font-bold text-light-text dark:text-gray-300 flex items-center space-x-1">
                <span>{stars}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
              </span>
              <div className="flex-1 h-2 mx-4 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${getRatingBarPercentage(stars)}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs text-light-muted dark:text-dark-muted font-bold">
                {productReviews.filter(r => r.rating === stars).length}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Section */}
      <div className="p-6 rounded-2xl glass-card border border-light-border dark:border-dark-border/40">
        <h4 className="font-bold text-base text-light-text dark:text-white uppercase tracking-widest mb-4 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span>Write a Customer Review</span>
        </h4>

        {currentUser ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}
            {success && <p className="text-sm text-emerald-500 font-semibold">{success}</p>}

            {/* Star selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-light-text dark:text-gray-300 mr-2">Your Rating:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-115 active:scale-95 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors duration-200 ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 dark:text-zinc-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment field */}
            <div>
              <label htmlFor="review-comment" className="block text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1.5">
                Review Details
              </label>
              <textarea
                id="review-comment"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience wearing this shoe..."
                className="w-full bg-[#fff8ed] dark:bg-dark-bg border border-[#f59e0b] dark:border-primary rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-[#0f172a] dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-sm"
                style={{ color: "#0f172a", WebkitTextFillColor: "#0f172a" }}
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-white py-2.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 shadow-md shadow-primary/25 active:scale-95 border border-primary/10"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Review</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-6 border border-dashed border-light-border dark:border-dark-border rounded-xl bg-gray-50/50 dark:bg-dark-bg/10">
            <p className="text-sm text-light-muted dark:text-dark-muted mb-3 font-semibold">
              Only logged-in customers can write reviews.
            </p>
            <a
              href="/auth"
              className="inline-block bg-primary hover:bg-primary-hover text-white text-xs font-bold tracking-wider uppercase px-5 py-2 rounded-full transition-all duration-300 active:scale-95 shadow-md shadow-primary/10"
            >
              Log In to Review
            </a>
          </div>
        )}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        <h4 className="font-bold text-base text-light-text dark:text-white uppercase tracking-widest">
          Customer Reviews ({productReviews.length})
        </h4>

        {productReviews.length === 0 ? (
          <div className="text-center py-8 text-light-muted dark:text-dark-muted text-sm border border-dashed border-light-border dark:border-dark-border rounded-xl">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {productReviews.map((review, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                key={review.id}
                className="p-5 rounded-2xl glass-card border border-light-border dark:border-dark-border/40 relative flex flex-col justify-between"
              >
                {/* Header: User name & Rating */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-1.5 rounded-full border border-primary/20">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-bold text-sm text-light-text dark:text-white">
                      {review.userName}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300 dark:text-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-light-muted dark:text-dark-muted font-semibold flex items-center space-x-1">
                      <Calendar className="w-3 h-3 inline" />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>

                {/* Comment text */}
                <p className="text-sm text-light-text/90 dark:text-gray-200 leading-relaxed pl-1">
                  {review.comment}
                </p>

                {/* Delete button (Admin or owner only) */}
                {currentUser && (isAdmin || currentUser.uid === review.userId) && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="absolute bottom-4 right-4 p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    aria-label="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
