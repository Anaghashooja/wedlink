const admin = require('firebase-admin');
let messaging = null;

try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    messaging = admin.messaging();
    console.log("Firebase Admin initialized successfully.");
} catch (error) {
    console.warn("⚠️ Firebase serviceAccountKey.json not found. Push notifications will be disabled.");
}

const sendPushNotification = async (fcmToken, title, body) => {
    if (!fcmToken || !messaging) return;
    const message = { notification: { title, body }, token: fcmToken };
    try {
        await messaging.send(message);
    } catch (error) { console.error('FCM Error:', error); }
};

module.exports = sendPushNotification;