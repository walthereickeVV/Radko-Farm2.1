const CACHE_NAME = 'radko-pharm-v1';

self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    // Пропускаем кеширование при установке
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetching', event.request.url);
    
    // Пропускаем все внешние запросы (CDN, Google Fonts, и т.д.)
    if (event.request.url.startsWith('http') && 
        !event.request.url.startsWith(self.location.origin)) {
        console.log('External resource, skipping cache:', event.request.url);
        return;
    }
    
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Кешируем только успешные GET запросы
                if (event.request.method === 'GET' && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Если нет сети, пытаемся получить из кеша
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Если нет в кеше, показываем офлайн страницу
                    return new Response('Нет подключения к интернету', {
                        status: 503,
                        statusText: 'Офлайн',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                });
            })
    );
});