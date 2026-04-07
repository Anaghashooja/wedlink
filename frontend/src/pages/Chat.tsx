import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000");

const Chat: React.FC = () => {
  const { id: otherId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [otherUser, setOtherUser] = useState<any>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myId = JSON.parse(atob(localStorage.getItem('token')!.split('.')[1])).id;
  const room = [myId, otherId].sort().join("_");

  useEffect(() => {
    if (!otherId || !myId) return;

    const currentToken = localStorage.getItem('token');

    fetch(`http://localhost:3000/api/auth/user/${otherId}`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    }).then(res => res.json()).then(data => setOtherUser(data));

    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/messages/history/${otherId}`, {
          headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    fetchHistory();

    socket.emit('join_chat', { room });

    const handleReceiveMessage = (data: any) => {
      console.log("Message received from socket:", data);
      if (data.sender !== myId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [otherId, myId, room]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // HANDLE FILE UPLOAD TO CLOUDINARY
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('photos', e.target.files[0]); // Using your existing 'photos' endpoint

    try {
      const res = await fetch('http://localhost:3000/api/auth/upload-temp', { // Create a simple upload route or reuse register logic
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await res.json();
      // Emit image message
      socket.emit('send_message', { room, sender: myId, receiver: otherId, text: "Sent an image", image: data.url, createdAt: new Date() });
    } catch (err) { alert("Upload failed"); } finally { setUploading(false); }
  };
 
const handleSend = () => {
  if (!inputText.trim() || !myId) return;

  const msgData = {
    room,
    sender: myId,
    receiver: otherId,
    text: inputText,
    createdAt: new Date().toISOString(),
  };

  console.log("Attempting to send:", msgData);

  // A. UPDATE LOCAL STATE IMMEDIATELY (So you see it)
  setMessages((prev) => [...prev, msgData]);

  // B. SEND TO SERVER
  socket.emit('send_message', msgData);

  // C. CLEAR INPUT
  setInputText("");
};
// Removed duplicate useEffect
  const handleReport = async () => {
    if (window.confirm("Are you sure you want to report this user?")) {
      await fetch(`http://localhost:3000/api/auth/report/${otherId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert("User reported.");
      setShowInfo(false);
    }
  };

  return (
    <div className="bg-[#fff8f4] h-screen flex flex-col font-inter overflow-hidden relative">
      
      {/* 1. VIDEO CALL OVERLAY (JITSI) */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] bg-black">
          <iframe 
            src={`https://meet.jit.si/${room}#config.startWithVideoMuted=false`} 
            className="w-full h-full border-none" 
            allow="camera; microphone; fullscreen; display-capture; autoplay"
          />
          <button onClick={() => setShowVideo(false)} className="absolute top-10 right-10 bg-red-600 text-white p-4 rounded-full 3xl:scale-150 font-bold">End Call</button>
        </div>
      )}

      {/* 2. INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] p-10 3xl:p-20 max-w-lg w-full shadow-2xl animate-fade-in">
            <h2 className="text-2xl 3xl:text-5xl font-bold text-gray-800 mb-4">User Information</h2>
            <div className="space-y-4 3xl:space-y-8 mb-10">
              <p className="text-lg 3xl:text-3xl text-gray-600">Verified Member since: <br/><b>{new Date(otherUser?.date).toLocaleDateString()}</b></p>
              <p className="text-green-600 font-bold 3xl:text-3xl">✓ Verified Identity</p>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={handleReport} className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-bold 3xl:text-3xl hover:bg-red-600 hover:text-white transition">Report User</button>
              <button onClick={() => setShowInfo(false)} className="w-full text-gray-400 font-bold py-2">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-md px-6 py-4 3xl:py-10 flex justify-between items-center shadow-sm border-b border-rose-50">
        <div className="flex items-center gap-4 3xl:gap-10">
          <button onClick={() => navigate(-1)} className="text-rose-900 3xl:scale-150"><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
          <img src={otherUser?.photos?.[0]} className="w-12 h-12 3xl:w-24 3xl:h-24 rounded-full object-cover" />
          <div>
            <h1 className="text-lg 3xl:text-5xl font-bold text-rose-900">{otherUser?.name}</h1>
            <p className="text-[10px] 3xl:text-2xl text-green-500 font-bold uppercase tracking-widest">Online</p>
          </div>
        </div>
        <div className="flex gap-6 3xl:gap-12 text-stone-400">
          <button onClick={() => setShowVideo(true)} className="hover:text-rose-500 3xl:scale-150"><span className="material-symbols-outlined">videocam</span></button>
          <button onClick={() => setShowInfo(true)} className="hover:text-rose-500 3xl:scale-150"><span className="material-symbols-outlined">info</span></button>
        </div>
      </header>

      {/* MESSAGES */}
     <main className="flex-1 mt-24 mb-28 px-6 space-y-4 overflow-y-auto custom-scrollbar">
  {messages.map((msg, index) => {
    // Determine if I sent this message
    const isMe = msg.sender === myId;

    return (
      <div key={index} className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start'} max-w-[85%]`}>
        <div className={`p-4 3xl:p-10 rounded-2xl shadow-sm text-sm 3xl:text-4xl ${
          isMe 
          ? 'bg-rose-600 text-white rounded-tr-none' 
          : 'bg-white text-gray-800 border border-rose-100 rounded-tl-none'
        }`}>
          {msg.text}
        </div>
        <span className="text-[10px] 3xl:text-2xl text-gray-400 mt-1 uppercase font-bold px-1">
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    );
  })}
  <div ref={scrollRef} /> {/* For auto-scroll */}
</main>

      {/* FOOTER INPUT */}
      <footer className="fixed bottom-0 w-full bg-white p-6 3xl:p-12 border-t border-rose-50">
        <div className="flex items-center gap-4">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 3xl:w-24 3xl:h-24 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center 3xl:scale-125">
             {uploading ? '...' : <span className="material-symbols-outlined">add</span>}
          </button>
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-stone-50 border-none rounded-full py-4 px-8 3xl:text-4xl outline-none" 
            placeholder="Type a message..." 
          />
          <button onClick={handleSend} className="w-14 h-14 3xl:w-28 3xl:h-28 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-700 3xl:scale-125">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;