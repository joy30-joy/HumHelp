jsx
import { useEffect, useState } from 'react';
import api from '../services/api.js';
import DonorCard from '../components/leaderboard/DonorCard.jsx';

export default function LeaderboardPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/api/leaderboard');
        setDonors(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Top Donors Leaderboard</h1>
        <p className="text-gray-600 mb-8">
          Our most helpful donors based on their contributions and ratings. 
          Help others to climb the leaderboard!
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No donors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donors.map((donor, index) => (
              <DonorCard 
                key={donor._id} 
                donor={donor} 
                position={index + 1} 
                isTopThree={index < 3}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
