export default function DonorCard({ donor, position, isTopThree }) {
  const getMedalColor = () => {
    switch (position) {
      case 1: return "bg-yellow-400 text-yellow-900";
      case 2: return "bg-gray-300 text-gray-900";
      case 3: return "bg-amber-700 text-amber-100";
      default: return "bg-gray-200 text-gray-800";
    }
  };
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${isTopThree ? "border-4 border-blue-500 scale-105" : ""}`}>
      <div className="p-6">
        <div className="flex items-center">
          <div className={`${getMedalColor()} w-10 h-10 rounded-full flex items-center justify-center font-bold`}>
            {position}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{donor.name}</h2>
            <p className="text-gray-600">{donor.email}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Points</span>
          <span className="text-2xl font-bold text-primary">{donor.points}</span>
        </div>
      </div>
      {isTopThree && (
        <div className={`p-2 text-center font-bold ${position === 1 ? "bg-yellow-400" : position === 2 ? "bg-gray-300" : "bg-amber-700 text-white"}`}>
          {position === 1 ? "🥇 Gold Medal Donor" : position === 2 ? "🥈 Silver Medal Donor" : "🥉 Bronze Medal Donor"}
        </div>
      )}
    </div>
  );
}
