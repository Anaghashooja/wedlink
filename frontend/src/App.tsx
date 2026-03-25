import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth'; // This is the Login/Register component we built earlier
import Matches from './pages/matches'; // This is the new Matches page we created
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Inbox from './pages/Inbox';
function App() {
  return (
    <Router>
      <Navbar/>
        
      <div className="min-h-screen bg-gray-50">
        {/* Navbar stays on all pages */}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/matches" element={<Matches />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<PublicProfile />} />
          <Route path="/inbox" element={<Inbox />} />
          {/* Add more routes here, like /matches or /profile */}
        </Routes>

        {/* Optional: Footer can go here */}
      </div>
    </Router>
  );
}

export default App;