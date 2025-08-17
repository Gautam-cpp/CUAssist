import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { canteenService } from '../../services/canteenService';
import type { CanteenReview } from '../../types';
import { Star, Clock, MapPin, User, MessageCircle } from 'lucide-react';
import ReviewForm from './ReviewForm';
import toast from 'react-hot-toast';

const CanteenDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [menu, setMenu] = useState<{ menuUrl?: string } | null>(null);
  const [reviews, setReviews] = useState<CanteenReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchCanteenData();
  }, [name]);

  const fetchCanteenData = async () => {
    if (!name) return;

    try {
      setLoading(true);
      const [menuResponse, reviewsResponse] = await Promise.allSettled([
        canteenService.getMenu(name),
        canteenService.getReviews(name),
      ]);

      if (menuResponse.status === 'fulfilled') {
        setMenu(menuResponse.value!);
      }

      if (reviewsResponse.status === 'fulfilled') {
        setReviews(reviewsResponse.value);
      }
    } catch (error) {
      console.error('Error fetching canteen data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    setShowReviewForm(false);
    fetchCanteenData();
    toast.success('Review added successfully!');
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-sm">({reviews.length} reviews)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Open Now</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span className="text-sm">Campus Location</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Write Review
          </button>
        </div>
      </div>

      {/* Menu Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
        {menu?.menuUrl ? (
          <div className="space-y-4">
            <img
              src={menu.menuUrl}
              alt={`${name} Menu`}
              className="w-full max-w-2xl rounded-lg shadow-lg"
            />
            <p className="text-sm text-gray-600">
              Menu last updated: Today
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MessageCircle className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600">Menu not available yet</p>
            <p className="text-sm text-gray-500 mt-2">
              We're working on getting the latest menu uploaded
            </p>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
        
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {review.user.profilePic ? (
                      <img
                        src={review.user.profilePic}
                        alt={review.user.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{review.user.username}</h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.messageReview}</p>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Food tried:</span> {review.foodTried}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No reviews yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Be the first to share your experience!
            </p>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          canteenName={name!}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleReviewAdded}
        />
      )}
    </div>
  );
};

export default CanteenDetail;