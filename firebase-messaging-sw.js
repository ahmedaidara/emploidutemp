// ========== SERVICE WORKER POUR NTFY ==========
// À placer dans firebase-messaging-sw.js ou créer un fichier ntfy-sw.js

// 1. Enregistre le Service Worker
async function enregistrerServiceWorker() {
    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/ntfy-sw.js');
        console.log('Service Worker enregistré');
        
        // Demander la permission pour les notifications
        const permission = await Notification.requestPermission();
        console.log('Permission:', permission);
        
        return registration;
    }
}

// 2. Fonction pour s'abonner à ntfy
async function ecouterNotificationsNTFY() {
    const registration = await enregistrerServiceWorker();
    
    // Récupérer le Service Worker actif
    const swRegistration = await navigator.serviceWorker.ready;
    
    // Établir la connexion SSE via le Service Worker
    const eventSource = new EventSource('https://ntfy.sh/mon_chat_ida_aidara/sse');
    
    eventSource.onmessage = (event) => {
        // Afficher la notification via le Service Worker
        swRegistration.showNotification('📩 Nouveau message', {
            body: event.data,
            icon: '/icon-192.png',
            vibrate: [200, 100, 200],
            requireInteraction: true
        });
    };
}
