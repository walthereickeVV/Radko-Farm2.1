const CACHE_NAME = 'radko-pharm-v1';

self.addEventListener('install', event => {
    console.log('Service Worker установлен');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker активирован');
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                console.log('Офлайн режим');
                return new Response('Нет подключения к интернету. Проверьте соединение и попробуйте снова.', {
                    status: 503,
                    headers: { 'Content-Type': 'text/plain' }
                });
            })
    );
});