// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configuration Firebase (fusionnée du premier fichier)
firebase.initializeApp({
    apiKey: "AIzaSyDGC2LQYeSrlb6MRwtLlQGDzz-yJHtKf8c",
    authDomain: "messagerie-65abc.firebaseapp.com",
    projectId: "messagerie-65abc",
    storageBucket: "messagerie-65abc.firebasestorage.app",
    messagingSenderId: "363641716532",
    appId: "1:363641716532:web:d16bd3b4eaf4abf4e8ef61"
});

const messaging = firebase.messaging();

// Gestion des notifications en arrière-plan (app fermée ou en arrière-plan)
messaging.onBackgroundMessage((payload) => {
    console.log('📱 Message reçu en arrière-plan:', payload);
    
    // Vérifier si l'app est ouverte
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        const appOuverte = clients.some(client => client.visibilityState === 'visible');
        
        // Ne pas afficher de notification système si l'app est ouverte
        if (appOuverte) {
            console.log('App ouverte - notification gérée par le frontend');
            return;
        }
        
        // Afficher la notification système seulement si l'app est fermée
        const title = payload.notification?.title || 'Nouveau message';
        const options = {
            body: payload.notification?.body || 'Vous avez reçu un message',
            icon: '/icon-192.png',
            vibrate: [200, 100, 200],
            badge: '/badge-icon.png', // Optionnel : icône pour la notification
            tag: 'message-notification', // Évite les doublons
            data: {
                click_action: '/',
                ...payload.data
            }
        };
        
        self.registration.showNotification(title, options);
    });
});

// Optionnel : Gérer le clic sur la notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Si une fenêtre est déjà ouverte, la focus
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Sinon, ouvrir une nouvelle fenêtre
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});
