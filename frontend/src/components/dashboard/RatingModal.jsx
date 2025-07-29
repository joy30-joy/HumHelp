import { useState } from "react";
import api from "../../services/api";

export default function RatingModal({ request, onClose, onRated }) {
  const [fraudReported, setFraudReported] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (fraudReported === null) return;
    setLoading(true);
    try {
      await api.post("/ratings", { requestId: request._id, fraudReported });
      onRated && onRated();
      onClose();
    } catch {
      alert("Failed to submit rating!");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Report Interaction</h2>
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded ${fraudReported === false ? "bg-green-500 text-white" : "bg-gray-100"}`}
                onClick={() => setFraudReported(false)}
                disabled={loading}
              >
                Not Fraud (+10 pts)
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded ${fraudReported === true ? "bg-red-500 text-white" : "bg-gray-100"}`}
                onClick={() => setFraudReported(true)}
                disabled={loading}
              >
                Fraud (-5 pts)
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={onClose} className="px-4 py-2 mr-2 rounded bg-gray-200" disabled={loading}>Cancel</button>
            <button
              className={"px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"}
              disabled={loading || fraudReported === null}
              onClick={handleSubmit}
            >{loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
