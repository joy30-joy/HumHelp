import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import RequestCard from '../components/dashboard/RequestCard';
import RequestForm from '../components/dashboard/RequestForm';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch requests for the logged-in user (both as donor and needer)
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/requests');
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users of opposite role for making new requests
  const fetchUsers = async () => {
    if (!user) return;
    try {
      const oppositeRole = user.role === 'donor' ? 'needer' : 'donor';
      const { data } = await api.get(`/auth/users?role=${oppositeRole}`);
      setUsers(data);
    } catch (error) {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchUsers();
    // eslint-disable-next-line
  }, [user]);

  const handleRequestCreated = (newReq) => setRequests(reqs => [newReq, ...reqs]);
  const handleStatusUpdate = (requestId, status) => setRequests(reqs =>
    reqs.map(r => r._id === requestId ? { ...r, status } : r)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
        <p className="text-gray-600">
          {user?.role === 'donor'
            ? 'Help those in need by responding to requests'
            : 'Request help from donors in your community'}
        </p>
        {user?.role === 'needer' && (
          <RequestForm users={users} onRequestCreated={handleRequestCreated} />
        )}
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {['Incoming', 'Sent', 'Completed'].map((category) => (
            <Tab key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )}>
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {/* Incoming */}
          <Tab.Panel>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid gap-4 mt-4">
                {requests
                  .filter(r => r.recipient._id === user._id && r.status === 'pending')
                  .map(request => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      onStatusUpdate={handleStatusUpdate}
                      currentUser={user}
                    />
                  ))}
              </div>
            )}
          </Tab.Panel>
          {/* Sent */}
          <Tab.Panel>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid gap-4 mt-4">
                {requests
                  .filter(r => r.requester._id === user._id)
                  .map(request => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      onStatusUpdate={handleStatusUpdate}
                      currentUser={user}
                    />
                  ))}
              </div>
            )}
          </Tab.Panel>
          {/* Completed */}
          <Tab.Panel>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid gap-4 mt-4">
                {requests
                  .filter(r =>
                    (r.recipient._id === user._id || r.requester._id === user._id) &&
                    r.status !== 'pending'
                  )
                  .map(request => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      onStatusUpdate={handleStatusUpdate}
                      currentUser={user}
                    />
                  ))}
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
