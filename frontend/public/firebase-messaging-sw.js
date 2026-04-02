importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js');

// Must match the exact config from your frontend/.env
const firebaseConfig = {
  apiKey: "AIzaSyBxZygabZUee__MMd7b7Lj2zBsAxkl161Y",
  authDomain: "wedlink-d7333.firebaseapp.com",
  projectId: "wedlink-d7333",
  messagingSenderId: "736719148709",
  appId: "1:736719148709:web:cbf5157bcad3db6f0d5f4c"
};

// Initialize the Firebase app in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Wedlink Update';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
