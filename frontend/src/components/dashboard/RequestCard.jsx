import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../services/api';
import RatingModal from './RatingModal';
import ReviewModal from './ReviewModal';

export default function RequestCard({ request, onStatusUpdate, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rated, setRated] = useState(false);
  const [reviewed, setReviewed] = useState(request.reviewedByRequester || false);

  const isRecipient = request.recipient._id === currentUser._id;
  const isRequester = request.requester._id === currentUser._id;

  const canRate = isRecipient && request.status === 'accepted' && currentUser.role === 'needer' && !rated;
  const canReview = isRequester && request.status === 'accepted' && !reviewed;

  useEffect(() => {
    if (canRate) {
      api.get(`/ratings/${request._id}`)
        .then(res => setRated(res.data.exists))
        .catch(() => setRated(false));
    }
  }, [request._id, request.status, isRecipient, currentUser.role]);

  const handleStatusChange = async (status) => {
    setLoading(true);
    try {
      await api.put(`/requests/${request._id}`, { status });
      onStatusUpdate(request._id, status);
    } catch (e) {
      alert('Could not update request!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div className="ml-3">
                <h3 className="font-medium">
                  {isRecipient ? request.requester.name : request.recipient.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
            <p className="mt-3 text-gray-700">{request.message}</p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              request.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : request.status === 'accepted'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {request.status === 'pending' && isRecipient && (
            <>
              <button
                onClick={() => handleStatusChange('accepted')}
                disabled={loading}
                className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                disabled={loading}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}

          {canRate && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Rate Interaction
            </button>
          )}

          {rated && (
            <span className="px-3 py-2 text-green-700 font-medium">Rated</span>
          )}

          {canReview && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-3 py-2 bg-purple-600 text-white rounded"
            >
              Leave Review
            </button>
          )}

          {reviewed && (
            <span className="px-3 py-2 text-purple-700 font-medium">Reviewed</span>
          )}
        </div>
      </div>

      {/* Modals */}
      {showRatingModal && (
        <RatingModal
          request={request}
          onClose={() => setShowRatingModal(false)}
          onRated={() => setRated(true)}
        />
      )}

      {showReviewModal && (
        <ReviewModal
          request={request}
          onClose={() => setShowReviewModal(false)}
          onSubmitted={() => {
            setReviewed(true);
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  );
}
