import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import { socket } from './socket';
import { useEffect } from 'react';
import NotificationToast from './components/NotificationToast';
 import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth'; // This is the Login/Register component we built earlier
import Matches from './pages/Matches'; // This is the new Matches page we created
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Inbox from './pages/Inbox';
import Messages from './pages/Messages'; 
import Chat from './pages/Chat'; 
import Search from './pages/Search';
import Plans from './pages/Plans';
import SuccessStories from './pages/SuccessStories';
import AdminDashboard from './pages/AdminDashboard';
import UserVerification from './pages/AdminUserVerification';
import { requestForToken, onMessageListener } from "./firebase";
import StoriesModeration from './pages/AdminStoriesModeration';
import ReportedChats from './pages/AdminReportedChats';
import AdminAnalytics from './pages/AdminAnalytics';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Settings from './pages/Settings';
function App() {  
 const [toast, setToast] = React.useState({ show: false, title: '', message: '', type: 'info' as any });

  // Helper to trigger notification
  const notify = (title: string, message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ show: true, title, message, type });
  };

  useEffect(() => {
    // 1. Listen for Real-time Socket Events
    socket.on("new_interest", (data) => {
       notify("New Interest! 💖", `${data.fromName} sent you a connection request.`, "info");
    });

    // 2. Listen for Real-time Messages
    socket.on("receive_message", (data) => {
       // Only notify if user is NOT on the chat page with this specific person
       if (window.location.pathname !== `/chat/${data.sender}`) {
         notify("New Message 💬", `You have a new message from a match.`, "success");
       }
    });

    // 3. Register FCM Token on Login
    const token = localStorage.getItem('token');
    if (token) {
      requestForToken(); 
    }

    // 4. Listen for Foreground FCM Messages
    onMessageListener().then((payload: any) => {
      notify(payload.notification.title, payload.notification.body, "info");
    }).catch(err => console.log('failed: ', err));

    return () => { socket.off("new_interest"); socket.off("receive_message"); };
  }, []);

  return (
    <Router>
      <Navbar/>
      
      {/* GLOBAL NOTIFICATION TOAST */}
      <NotificationToast 
        {...toast} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
        
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/matches" element={<Matches />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<PublicProfile />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/search" element={<Search />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/stories" element={<SuccessStories />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/verify" element={<UserVerification />} />
          <Route path="/admin/stories" element={<StoriesModeration />} />
          <Route path="/admin/reports" element={<ReportedChats/>}/>
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/checkout/:plan" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/settings" element={<Settings />} /> 
        </Routes>

        {/* Optional: Footer can go here */}
      </div>
    </Router>
  );
}

export default App;