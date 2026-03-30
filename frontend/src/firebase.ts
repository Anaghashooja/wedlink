import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBxZygabZUee__MMd7b7Lj2zBsAxkl161Y",
  authDomain: "wedlink-d7333.firebaseapp.com",
  projectId: "wedlink-d7333",
  messagingSenderId:"736719148709",
  appId: "1:736719148709:web:cbf5157bcad3db6f0d5f4c",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (userId: string) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: "BKVmH6Rm6kwym7EsJnn34KcysJU0xtdCyOp1snV6wEFZe00vCEVntoEbjBv6jEqhxL2WxkhxpDUrRPSu9ZYgHoM" });
      if (token) {
        // Send this token to backend to save in User model
        await fetch('http://localhost:3000/api/auth/save-fcm-token', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ fcmToken: token })
        });
      }
    }
  } catch (error) { console.error(error); }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => { resolve(payload); });
  });