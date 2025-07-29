import { useEffect, useState } from "react";
import api from "../services/api";
import DonorCard from "../components/leaderboard/DonorCard";
import DonorReviewsPanel from "../components/leaderboard/DonorReviewsPanel";

export default function LeaderboardPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewsFor, setShowReviewsFor] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/leaderboard");
        setDonors(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Top Donors Leaderboard</h1>
        <p className="text-gray-600 mb-8">
          These are the most helpful donors based on verified requests.
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No donors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donors.map((donor, i) => (
              <div key={donor._id}>
                <DonorCard donor={donor} position={i + 1} isTopThree={i < 3} />
                <button
                  className="text-primary underline mt-2 text-sm"
                  onClick={() => setShowReviewsFor(donor._id)}
                >
                  Show Reviews
                </button>

                {showReviewsFor === donor._id && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded shadow max-w-lg w-full relative">
                      <button
                        className="absolute top-2 right-2 text-gray-500"
                        onClick={() => setShowReviewsFor(null)}
                      >
                        ✖
                      </button>
                      <h3 className="font-bold text-lg mb-2">
                        Reviews for {donor.name}
                      </h3>
                      <DonorReviewsPanel donorId={donor._id} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
