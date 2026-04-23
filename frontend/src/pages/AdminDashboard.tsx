import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { API_BASE_URL } from '../config';

 

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [pendingStories, setPendingStories] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const resStats = await fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resStats.ok) {
        setStats(await resStats.json());
      }

      const resStories = await fetch(`${API_BASE_URL}/api/admin/stories/pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      const storiesData = await resStories.json();
      if (resStories.ok && Array.isArray(storiesData)) {
        setPendingStories(storiesData);
      } else {
        console.error("Error fetching stories:", storiesData);
        setPendingStories([]);
      }
    } catch (err) {
      console.error("Network error:", err);
      setPendingStories([]);
    }
  };


  const approveStory = async (id: string) => {
    await fetch(`${API_BASE_URL}/api/admin/stories/approve/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchData(); // Refresh
  };
  useEffect(() => {
  // 1. Initial fetch
  fetchData();

  // 2. Real-time listener
  const socket = io(API_BASE_URL);
  
  socket.on("admin_update_stats", () => {
    console.log("New registration detected! Refreshing dashboard...");
    fetchData(); // This re-runs your API calls automatically
  });

  return () => {
    socket.disconnect();
  };
}, []);

  return (
    <div className="min-h-screen bg-gray-100 ml-64 flex flex-col">
      
      <AdminSidebar />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-10 3xl:p-32 space-y-10 3xl:space-y-24">
        
        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 3xl:gap-16">
          <StatCard title="Total Users" value={stats?.totalUsers || 0} icon="groups" color="text-blue-500" />
          <StatCard title="ID Verifications" value={stats?.pendingVerify || 0} icon="badge" color="text-amber-500" />
          <StatCard title="Story Requests" value={stats?.pendingStories || 0} icon="auto_stories" color="text-rose-500" />
        </div>

        {/* STORY APPROVAL TABLE */}
        <div className="bg-white rounded-3xl p-8 3xl:p-20 shadow-sm">
          <h3 className="text-2xl 3xl:text-6xl font-bold mb-8">Pending Success Stories</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left 3xl:text-3xl">
              <thead>
                <tr className="text-gray-400 border-b">
                  <th className="pb-4">Couple</th>
                  <th className="pb-4">Location</th>
                  <th className="pb-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Array.isArray(pendingStories) && pendingStories.map(story => (
                  <tr key={story._id}>
                    <td className="py-4 font-bold">{story.coupleNames}</td>
                    <td className="py-4">{story.location}</td>
                    <td className="py-4">
                      <button onClick={() => approveStory(story._id)} className="bg-green-500 text-white px-4 py-1 rounded-lg 3xl:px-12 3xl:py-4 hover:bg-green-600 font-bold">Approve</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-8 3xl:p-20 rounded-3xl shadow-sm flex items-center gap-6">
    <div className={`w-16 h-16 3xl:w-32 3xl:h-32 rounded-full bg-gray-50 flex items-center justify-center ${color}`}>
      <span className="material-symbols-outlined text-4xl 3xl:text-8xl">{icon}</span>
    </div>
    <div>
      <p className="text-gray-400 font-bold 3xl:text-3xl uppercase tracking-widest">{title}</p>
      <p className="text-4xl 3xl:text-9xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;