import { useState } from "react";
import api from "../../services/api";

export default function RequestForm({ users, onRequestCreated }) {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/requests", { recipientId: recipient, message });
      onRequestCreated(data);
      setRecipient('');
      setMessage('');
    } catch {
      alert("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mb-6">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2" htmlFor="recipient">Select Donor</label>
        <select
          id="recipient"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded"
          required
        >
          <option value="">Choose a donor</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2" htmlFor="message">Your Request</label>
        <textarea
          id="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded"
          required
          placeholder="Describe what you need help with..."
        />
      </div>
      <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded">
        {loading ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}
