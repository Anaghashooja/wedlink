import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Helper to get messaging instance safely
const getMessagingSafe = async () => {
  try {
    if (await isSupported()) {
      return getMessaging(app);
    }
  } catch (err) {
    console.warn("Firebase Messaging not supported in this environment:", err);
  }
  return null;
};

export const requestForToken = async () => {
  try {
    const messaging = await getMessagingSafe();
    if (!messaging) return;

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { 
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY 
      });
      
      if (token) {
        await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/auth/save-fcm-token', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ fcmToken: token })
        });
      }
    }
  } catch (error) { console.error("Error requesting FCM token:", error); }
};

export const onMessageListener = async () => {
  const messaging = await getMessagingSafe();
  if (!messaging) return null;

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => { resolve(payload); });
  });
};