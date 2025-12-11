// Основной скрипт Radko-Pharm (заменяет main.js из ранних версий)

console.log('🚀 Radko-Pharm v2.0.0 загружается...');

// Глобальные переменные
let currentLang = 'ru';
let cartItems = JSON.parse(localStorage.getItem('radko_cart')) || [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM загружен, инициализация...');
    
    // Инициализация компонентов
    initPreloader();
    initLanguage();
    initCart();
    initProducts();
    initNavigation();
    initAI();
    initEvents();
    
    // Запуск анимаций
    startAnimations();
    
    console.log('✅ Radko-Pharm успешно загружен!');
});

// ===== ПРЕЛОАДЕР =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
                showNotification('Добро пожаловать в Radko-Pharm!', 'success');
            }, 500);
        }, 2000);
    }
}

// ===== ЯЗЫК =====
function initLanguage() {
    // Загрузка сохраненного языка
    const savedLang = localStorage.getItem('radko_lang');
    if (savedLang) {
        currentLang = savedLang;
    }
    
    // Установка активной кнопки языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            setLanguage(lang);
        });
    });
    
    // Применяем язык
    applyLanguage();
}

function setLanguage(lang) {
    if (lang !== currentLang) {
        currentLang = lang;
        localStorage.setItem('radko_lang', lang);
        applyLanguage();
        showNotification('Язык изменен на ' + (lang === 'ru' ? 'русский' : lang === 'ar' ? 'арабский' : 'английский'), 'success');
    }
}

function applyLanguage() {
    // Обновляем все тексты
    updateTexts();
    
    // Меняем направление для арабского
    if (currentLang === 'ar') {
        document.body.classList.add('rtl');
        document.documentElement.dir = 'rtl';
    } else {
        document.body.classList.remove('rtl');
        document.documentElement.dir = 'ltr';
    }
}

function updateTexts() {
    // Простая система переводов
    const translations = {
        'ru': {
            'nav_home': 'Главная',
            'nav_products': 'Товары',
            'nav_ai': 'AI Доктор',
            'nav_services': 'Услуги',
            'nav_pharmacy': 'Моя аптечка',
            'nav_contact': 'Контакты',
            'btn_consult_free': 'Бесплатная консультация',
            'btn_explore': 'Исследовать каталог',
            'search_placeholder': 'Поиск лекарств...'
        },
        'ar': {
            'nav_home': 'الرئيسية',
            'nav_products': 'المنتجات',
            'nav_ai': 'الذكاء الاصطناعي',
            'nav_services': 'الخدمات',
            'nav_pharmacy': 'صيدليتي',
            'nav_contact': 'اتصل بنا',
            'btn_consult_free': 'استشارة مجانية',
            'btn_explore': 'استعرض الكتالوج',
            'search_placeholder': 'بحث الأدوية...'
        },
        'en': {
            'nav_home': 'Home',
            'nav_products': 'Products',
            'nav_ai': 'AI Doctor',
            'nav_services': 'Services',
            'nav_pharmacy': 'My Pharmacy',
            'nav_contact': 'Contact',
            'btn_consult_free': 'Free Consultation',
            'btn_explore': 'Explore Catalog',
            'search_placeholder': 'Search medicines...'
        }
    };
    
    // Применяем переводы
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
}

// ===== КОРЗИНА =====
function initCart() {
    updateCartCount();
    
    // Кнопка корзины
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            renderCartItems();
        });
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }
}

function addToCart(productId, quantity = 1) {
    // Поиск продукта
    let product = null;
    if (window.PRODUCTS_DB) {
        product = PRODUCTS_DB.getProductById(productId);
    }
    
    if (!product) {
        showNotification('Товар не найден', 'error');
        return;
    }
    
    // Проверяем есть ли уже в корзине
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({
            id: productId,
            quantity: quantity,
            name: product.name[currentLang] || product.name.ru || product.name,
            price: product.price,
            image: product.image || '💊'
        });
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('radko_cart', JSON.stringify(cartItems));
    
    // Обновляем интерфейс
    updateCartCount();
    
    // Показываем уведомление
    const productName = product.name[currentLang] || product.name.ru || product.name;
    showNotification(`${productName} добавлен в корзину!`, 'success');
    
    // Воспроизводим звук
    playSound('add');
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('radko_cart', JSON.stringify(cartItems));
    updateCartCount();
    renderCartItems();
    showNotification('Товар удален из корзины', 'info');
}

function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Обновляем бейдж
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Обновляем счетчик в заголовке
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = `(${totalItems})`;
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalElem = document.getElementById('cart-total');
    
    if (!container) return;
    
    if (cartItems.length === 0) {
        container.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        if (totalElem) totalElem.textContent = '0 ег.ф.';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${item.price} ег.ф. × ${item.quantity}</div>
                    <div class="cart-item-actions">
                        <button class="btn-remove" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    if (totalElem) {
        totalElem.textContent = `${total} ег.ф.`;
    }
}

// ===== ТОВАРЫ =====
function initProducts() {
    renderProducts();
    setupProductFilters();
}

function renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    // Проверяем доступность базы данных
    if (!window.PRODUCTS_DB) {
        container.innerHTML = '<p>Загрузка товаров...</p>';
        return;
    }
    
    const products = PRODUCTS_DB.getProducts();
    
    container.innerHTML = products.map(product => {
        const category = PRODUCTS_DB.getCategory(product.category);
        const categoryName = category ? category.name[currentLang] || category.name.ru : product.category;
        
        return `
            <div class="product-card">
                <div class="product-image">${product.image || '💊'}</div>
                <div class="product-info">
                    <span class="product-category">${categoryName}</span>
                    <h3>${product.name[currentLang] || product.name.ru || product.name}</h3>
                    <p>${product.description[currentLang] || product.description.ru || product.description}</p>
                    <div class="product-price">${product.price} ег.ф.</div>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> В корзину
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupProductFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Добавляем текущей
            this.classList.add('active');
            
            // Фильтруем товары
            const filter = this.dataset.filter;
            filterProducts(filter);
        });
    });
}

function filterProducts(filter) {
    if (!window.PRODUCTS_DB) return;
    
    const products = PRODUCTS_DB.getProducts(filter);
    const container = document.getElementById('products-grid');
    
    if (!container) return;
    
    container.innerHTML = products.map(product => {
        return `
            <div class="product-card">
                <div class="product-image">${product.image || '💊'}</div>
                <div class="product-info">
                    <h3>${product.name[currentLang] || product.name.ru || product.name}</h3>
                    <p>${product.description[currentLang] || product.description.ru || product.description}</p>
                    <div class="product-price">${product.price} ег.ф.</div>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        В корзину
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== НАВИГАЦИЯ =====
function initNavigation() {
    // Меню на мобильных
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Закрываем меню на мобильных
                if (window.innerWidth < 768 && mainNav) {
                    mainNav.classList.remove('active');
                }
            }
        });
    });
}

// ===== AI КОНСУЛЬТАНТ =====
function initAI() {
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    
    if (sendBtn && messageInput) {
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Быстрые вопросы
    document.querySelectorAll('.quick-questions button').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            if (messageInput) {
                messageInput.value = question;
                sendMessage();
            }
        });
    });
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const messagesContainer = document.getElementById('chat-messages');
    
    if (!input || !input.value.trim()) return;
    
    const message = input.value.trim();
    
    // Добавляем сообщение пользователя
    addMessageToChat('user', message);
    
    // Очищаем поле
    input.value = '';
    
    // Имитируем ответ AI
    setTimeout(() => {
        const responses = [
            "Это хороший вопрос. Как AI-консультант аптеки, я рекомендую проконсультироваться с фармацевтом для точной информации.",
            "Для этого препарата рекомендуемая дозировка указана в инструкции. Всегда следуйте рекомендациям врача.",
            "Побочные эффекты могут варьироваться. Пожалуйста, обратитесь к фармацевту за подробной информацией.",
            "Совместимость лекарств важна. Рекомендую проконсультироваться с врачом перед совмещением препаратов.",
            "У нас есть аналоги этого лекарства. Могу помочь подобрать подходящий вариант по цене и эффективности."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessageToChat('ai', randomResponse);
    }, 1000 + Math.random() * 2000);
}

function addMessageToChat(sender, text) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="avatar">${sender === 'ai' ? '🤖' : '👤'}</div>
        <div class="content">
            <div class="text">${text}</div>
            <div class="time">${time}</div>
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// ===== СОБЫТИЯ =====
function initEvents() {
    // Кнопка консультации
    const consultBtn = document.getElementById('consult-btn');
    if (consultBtn) {
        consultBtn.addEventListener('click', () => {
            document.querySelector('#ai-doctor').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Кнопка товаров
    const productsBtn = document.getElementById('products-btn');
    if (productsBtn) {
        productsBtn.addEventListener('click', () => {
            document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Заказ через WhatsApp
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartItems.length === 0) {
                showNotification('Корзина пуста!', 'error');
                return;
            }
            
            // Формируем сообщение для WhatsApp
            let message = 'Здравствуйте! Хочу заказать:\n\n';
            let total = 0;
            
            cartItems.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                message += `${index + 1}. ${item.name} × ${item.quantity} = ${itemTotal} ег.ф.\n`;
            });
            
            message += `\nИтого: ${total} ег.ф.\n`;
            message += `Имя: __________\n`;
            message += `Адрес: __________\n`;
            message += `Телефон: __________`;
            
            const phone = '201275929754';
            const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
            
            // Очищаем корзину после заказа
            cartItems = [];
            localStorage.setItem('radko_cart', JSON.stringify(cartItems));
            updateCartCount();
            renderCartItems();
            
            // Закрываем корзину
            const cartSidebar = document.getElementById('cart-sidebar');
            if (cartSidebar) {
                cartSidebar.classList.remove('active');
            }
            
            showNotification('Заказ отправлен в WhatsApp!', 'success');
        });
    }
}

// ===== АНИМАЦИИ =====
function startAnimations() {
    // Анимация счетчиков
    animateCounters();
    
    // Анимация при скролле
    setupScrollAnimations();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count || counter.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + '+';
        }, 16);
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    // Наблюдаем за элементами с анимацией
    document.querySelectorAll('.service-card, .review-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== УТИЛИТЫ =====
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">✕</button>
        </div>
    `;
    
    // Стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Закрытие по таймеру
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Закрытие по клику
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Добавляем стили для анимаций если их нет
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                margin-left: 15px;
                cursor: pointer;
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(style);
    }
}

function playSound(type) {
    try {
        // Создаем звук на лету
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = type === 'add' ? 800 : 600;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Звук не поддерживается:', e);
    }
}

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ =====
// Делаем функции доступными глобально
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.setLanguage = setLanguage;
window.sendMessage = sendMessage;

console.log('📦 script.js загружен и готов!');