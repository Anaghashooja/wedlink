import React, { useEffect, useState } from 'react';

const Inbox: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/requests/received', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching inbox");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/requests/update/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        // Remove the processed request from the list
        setRequests(prev => prev.filter(req => req._id !== id));
        
        // Show notification
        setNotification({ 
          msg: status === 'accepted' ? 'Connection Accepted! Go to "Messages" to start chatting.' : 'Request Declined.',
          type: status === 'accepted' ? 'success' : 'info'
        });

        // Hide notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      alert("Error updating request");
    }
  };

  if (loading) return <div className="text-center py-20 3xl:text-4xl text-rose-500 font-bold">Checking for new interests...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 3xl:p-24 relative">
      
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`fixed top-24 right-10 z-50 animate-bounce-slow px-8 py-4 rounded-2xl shadow-2xl text-white font-bold 3xl:text-3xl ${notification.type === 'success' ? 'bg-green-500' : 'bg-gray-700'}`}>
          {notification.type === 'success' ? '✅ ' : 'ℹ️ '} {notification.msg}
        </div>
      )}

      <div className="max-w-6xl 3xl:max-w-[2200px] mx-auto">
        <h1 className="text-3xl md:text-5xl 3xl:text-8xl font-bold text-gray-800 mb-10">
          Interest Requests <span className="text-rose-500">({requests.length})</span>
        </h1>

        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
             <div className="text-6xl mb-4">💌</div>
             <p className="text-gray-400 text-xl 3xl:text-5xl italic">Your inbox is empty. Try connecting with more people!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 3xl:gap-16">
            {requests.map((req) => (
              <div key={req._id} className="bg-white p-6 3xl:p-12 rounded-[2.5rem] shadow-xl border border-rose-50 flex gap-6 items-center transform transition-all hover:scale-[1.02]">
                <img 
                  src={req.sender.photos?.[0] || `https://ui-avatars.com/api/?name=${req.sender.name}`}
                  className="w-24 h-24 md:w-32 md:h-32 3xl:w-60 3xl:h-60 rounded-full object-cover border-4 border-rose-100"
                  alt=""
                />
                
                <div className="flex-grow space-y-2 3xl:space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl 3xl:text-5xl font-bold text-gray-800 uppercase">{req.sender.name}</h3>
                    <p className="text-rose-500 font-semibold 3xl:text-3xl">{req.sender.profession || 'Member'}</p>
                  </div>

                  <div className="flex gap-3 pt-2 3xl:gap-8">
                    <button 
                      onClick={() => handleAction(req._id, 'accepted')}
                      className="flex-grow bg-green-500 text-white font-bold py-3 3xl:py-8 rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-100 3xl:text-3xl active:scale-95"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleAction(req._id, 'rejected')}
                      className="flex-grow bg-gray-100 text-gray-500 font-bold py-3 3xl:py-8 rounded-xl hover:bg-gray-200 transition 3xl:text-3xl active:scale-95"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;