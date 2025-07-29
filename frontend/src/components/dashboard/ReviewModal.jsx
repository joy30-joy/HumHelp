import { useState } from 'react';
import { createReview } from '../../services/reviewService';

export default function ReviewModal({ request, onClose, onSubmitted }) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReview({ requestId: request._id, comment });
      onSubmitted();
      onClose();
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 shadow max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4">Leave a Review for Donor</h2>
        <textarea
          className="w-full border p-2 rounded mb-4"
          rows={4}
          required
          placeholder="Your comment about the donor..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
