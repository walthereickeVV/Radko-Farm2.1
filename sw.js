// Service Worker для Radko-Pharm
const CACHE_NAME = 'radko-pharm-v2.0.0';
const OFFLINE_URL = '/offline.html';

// Файлы для кэширования
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/config.js',
    '/products.js',
    '/cart.js',
    '/ai.js',
    '/pharmacy.js',
    '/i18n.js',
    '/main.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800;900&family=Montserrat:wght@300;400;500;600;700;800&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/luxon@3.3.0/build/global/luxon.min.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('[Service Worker] Установка');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Кэширование файлов');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] Установка завершена');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[Service Worker] Ошибка при кэшировании:', error);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    console.log('[Service Worker] Активация');
    
    // Очистка старых кэшей
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Удаление старого кэша:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('[Service Worker] Активация завершена');
            return self.clients.claim();
        })
    );
});

// Обработка запросов
self.addEventListener('fetch', event => {
    // Пропускаем неподходящие запросы
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith('http')) return;
    
    // Для API запросов используем стратегию Network First
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Клонируем ответ для кэширования
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    return response;
                })
                .catch(() => {
                    // Если сеть недоступна, пытаемся получить из кэша
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // Для статических ресурсов используем стратегию Cache First
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('[Service Worker] Используем кэш для:', event.request.url);
                    return cachedResponse;
                }
                
                // Если нет в кэше, загружаем из сети
                return fetch(event.request)
                    .then(response => {
                        // Проверяем валидность ответа
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Клонируем ответ для кэширования
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.log('[Service Worker] Ошибка загрузки:', error);
                        
                        // Для HTML страниц показываем офлайн страницу
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match(OFFLINE_URL);
                        }
                        
                        // Для других ресурсов возвращаем заглушку
                        return new Response('Офлайн режим', {
                            status: 503,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});

// Обработка push-уведомлений
self.addEventListener('push', event => {
    console.log('[Service Worker] Push уведомление получено');
    
    if (!event.data) return;
    
    const data = event.data.json();
    const title = data.title || 'Radko-Pharm';
    const options = {
        body: data.body || 'Новое уведомление',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        },
        actions: [
            {
                action: 'open',
                title: 'Открыть'
            },
            {
                action: 'close',
                title: 'Закрыть'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Клик по уведомлению');
    
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.matchAll({ type: 'window' })
                .then(clientList => {
                    // Ищем открытое окно
                    for (const client of clientList) {
                        if (client.url === event.notification.data.url && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    
                    // Если окно не найдено, открываем новое
                    if (clients.openWindow) {
                        return clients.openWindow(event.notification.data.url);
                    }
                })
        );
    }
});

// Обработка синхронизации в фоне
self.addEventListener('sync', event => {
    console.log('[Service Worker] Синхронизация:', event.tag);
    
    if (event.tag === 'sync-orders') {
        event.waitUntil(syncOrders());
    } else if (event.tag === 'sync-medications') {
        event.waitUntil(syncMedications());
    }
});

// Синхронизация заказов
async function syncOrders() {
    try {
        // Получаем данные из IndexedDB или localStorage
        const orders = await getPendingOrders();
        
        for (const order of orders) {
            // Отправляем заказ на сервер
            const response = await fetch(`${CONFIG.API.baseUrl}/api/v1/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });
            
            if (response.ok) {
                // Помечаем заказ как синхронизированный
                await markOrderAsSynced(order.id);
                
                // Показываем уведомление
                self.registration.showNotification('Заказ синхронизирован', {
                    body: `Заказ #${order.id} успешно отправлен`,
                    icon: '/icons/icon-192.png'
                });
            }
        }
    } catch (error) {
        console.error('[Service Worker] Ошибка синхронизации заказов:', error);
    }
}

// Синхронизация данных аптечки
async function syncMedications() {
    try {
        const medications = await getLocalMedications();
        
        const response = await fetch(`${CONFIG.API.baseUrl}/api/v1/pharmacy/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ medications })
        });
        
        if (response.ok) {
            console.log('[Service Worker] Данные аптечки синхронизированы');
        }
    } catch (error) {
        console.error('[Service Worker] Ошибка синхронизации аптечки:', error);
    }
}

// Вспомогательные функции
async function getPendingOrders() {
    // В реальном приложении здесь была бы работа с IndexedDB
    return JSON.parse(localStorage.getItem('radko_pending_orders') || '[]');
}

async function markOrderAsSynced(orderId) {
    const orders = await getPendingOrders();
    const updatedOrders = orders.filter(order => order.id !== orderId);
    localStorage.setItem('radko_pending_orders', JSON.stringify(updatedOrders));
}

async function getLocalMedications() {
    return JSON.parse(localStorage.getItem('radko_medications') || '[]');
}

// Обработка фоновых сообщений
self.addEventListener('message', event => {
    console.log('[Service Worker] Сообщение:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME);
    }
});