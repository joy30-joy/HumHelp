import { useEffect, useState } from 'react';
import { getReviewsOfDonor } from '../../services/reviewService';

export default function DonorReviewsPanel({ donorId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!donorId) return;
    setLoading(true);
    getReviewsOfDonor(donorId)
      .then(setReviews)
      .finally(() => setLoading(false));
  }, [donorId]);

  if (loading) return <div>Loading reviews...</div>;
  if (!reviews.length) return <div>No reviews yet.</div>;
  return (
    <div className="mt-4 space-y-4">
      {reviews.map(r => (
        <div key={r._id} className="border p-3 rounded bg-gray-50">
          <div className="text-sm text-gray-600 mb-1">
            <b>{r.needer.name}</b> (request: "{r.request.message}")
            <span className="float-right text-xs">{(new Date(r.createdAt)).toLocaleString()}</span>
          </div>
          <div>{r.comment}</div>
        </div>
      ))}
    </div>
  );
}
