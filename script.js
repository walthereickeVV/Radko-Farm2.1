// ===== CONFIGURATION =====
const CONFIG = {
    SITE_NAME: 'Radko-Pharm',
    OWNER: {
        name: 'Раед Махмуд Хейри Ахмед',
        name_en: 'Raed Mahmoud Kheiry Ahmed',
        phone: '+20 127 592 9754',
        license: 'JT5179743',
        address: 'Здание Хафар Аль-Батин, кв. 502, Эль-Хамам, провинция Матрух, Египет'
    },
    PHARMACY: {
        location: 'Эль-Ашрин, Египет',
        coordinates: { lat: 30.1234, lng: 31.5678 },
        workingHours: '24/7'
    }
};

// ===== STATE MANAGEMENT =====
let currentLang = 'ru';
let currentTheme = 'light';
let cart = JSON.parse(localStorage.getItem('radko-pharm-cart')) || [];
let user = JSON.parse(localStorage.getItem('radko-pharm-user')) || null;
let aiChatHistory = JSON.parse(localStorage.getItem('radko-pharm-chat')) || [];

// ===== TRANSLATIONS =====
const TRANSLATIONS = {
    ru: {
        // Общие
        loading: "Загрузка...",
        searchPlaceholder: "Поиск лекарств или консультаций...",
        addToCart: "В корзину",
        viewDetails: "Подробнее",
        cartEmpty: "Корзина пуста",
        total: "Итого",
        checkout: "Оформить заказ",
        close: "Закрыть",
        save: "Сохранить",
        cancel: "Отмена",
        
        // Категории
        categories: {
            all: "Все",
            antibiotics: "Антибиотики",
            painkillers: "Обезболивающие",
            vitamins: "Витамины",
            chronic: "Хронические болезни",
            children: "Для детей",
            skincare: "Уход за кожей"
        },
        
        // AI Доктор
        aiWelcome: "Привет! Я Dr. DeepSeek, ваш умный медицинский помощник",
        aiPlaceholder: "Введите ваш медицинский вопрос здесь...",
        aiDisclaimer: "Примечание: Это предварительная консультация и не заменяет визит к врачу",
        aiTyping: "Печатает...",
        
        // Уведомления
        addedToCart: "Добавлено в корзину",
        removedFromCart: "Удалено из корзины",
        orderPlaced: "Заказ оформлен успешно",
        reviewSubmitted: "Спасибо за ваш отзыв!",
        subscribed: "Подписан на рассылку",
        
        // Формы
        name: "Имя",
        email: "Email",
        phone: "Телефон",
        message: "Сообщение",
        submit: "Отправить",
        required: "Обязательно",
        
        // Владелец
        owner: "Владелец аптеки",
        license: "Лицензия",
        experience: "Опыт",
        location: "Местоположение"
    }
};

// ===== PRODUCTS DATABASE =====
const PRODUCTS = [
    {
        id: 1,
        name: "Амоксициллин 500 мг",
        category: "antibiotics",
        description: "Антибиотик широкого спектра для лечения бактериальных инфекций",
        price: 85,
        originalPrice: 95,
        discount: 10,
        image: "💊",
        stock: 150,
        dosage: "1 капсула каждые 8 часов",
        sideEffects: "Может вызывать расстройство желудка",
        requiresPrescription: true,
        rating: 4.5,
        reviews: 124
    },
    {
        id: 2,
        name: "Парацетамол 500 мг",
        category: "painkillers",
        description: "Обезболивающее и жаропонижающее средство",
        price: 25,
        originalPrice: 30,
        discount: 16,
        image: "💊",
        stock: 500,
        dosage: "1 таблетка каждые 6 часов",
        sideEffects: "Редко вызывает побочные эффекты",
        requiresPrescription: false,
        rating: 4.8,
        reviews: 356
    },
    {
        id: 3,
        name: "Витамин C 1000 мг",
        category: "vitamins",
        description: "Пищевая добавка для укрепления иммунитета",
        price: 45,
        image: "💊",
        stock: 200,
        dosage: "1 таблетка в день",
        sideEffects: "Может вызывать легкое расстройство желудка",
        requiresPrescription: false,
        rating: 4.7,
        reviews: 189
    },
    {
        id: 4,
        name: "Метформин 850 мг",
        category: "chronic",
        description: "Для лечения диабета 2 типа, регулирует уровень сахара",
        price: 65,
        image: "💊",
        stock: 120,
        dosage: "1 таблетка в день после еды",
        sideEffects: "Может вызывать расстройство ЖКТ",
        requiresPrescription: true,
        rating: 4.6,
        reviews: 98
    },
    {
        id: 5,
        name: "Ибупрофен 400 мг",
        category: "painkillers",
        description: "Противовоспалительное и обезболивающее средство",
        price: 35,
        image: "💊",
        stock: 300,
        dosage: "1 таблетка каждые 8 часов",
        sideEffects: "Может вызывать расстройство желудка",
        requiresPrescription: false,
        rating: 4.4,
        reviews: 267
    }
];

// ===== REVIEWS DATABASE =====
const REVIEWS = [
    {
        id: 1,
        name: "Ахмед Мохамед",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
        rating: 5,
        text: "Лучшая аптека в Эль-Ашрин! AI-консультант помог определить правильную дозировку.",
        date: "2024-02-20",
        verified: true
    },
    {
        id: 2,
        name: "Сара Халид",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        rating: 4.5,
        text: "Все лекарства в наличии, весь персонал профессиональный.",
        date: "2024-01-15",
        verified: true
    }
];

// ===== AI RESPONSES =====
const AI_RESPONSES = {
    ru: {
        greetings: [
            "Привет! Я Dr. DeepSeek, ваш умный медицинский помощник. Как я могу помочь вам сегодня?",
            "Добро пожаловать! Я здесь, чтобы ответить на ваши медицинские вопросы. Что вас беспокоит?",
            "Приветствую! Я ваш цифровой помощник в Radko-Pharm. У вас есть медицинский вопрос?"
        ],
        symptoms: {
            fever: "Температура может быть признаком инфекции. Пейте жидкости, принимайте парацетамол, и если это продолжается более 3 дней, обратитесь к врачу.",
            headache: "Головная боль может быть из-за стресса или обезвоживания. Попробуйте отдохнуть и пить воду. Если сильная или с другими симптомами, обратитесь к врачу.",
            cough: "Сухой кашель требует теплых жидкостей, влажный может потребовать отхаркивающего средства. Если длится более недели или с температурой, обратитесь к врачу."
        },
        medications: {
            dosage: "Дозировка зависит от возраста, веса и состояния здоровья. Проверьте аннотацию или проконсультируйтесь с фармацевтом для точной дозировки.",
            interaction: "Некоторые лекарства взаимодействуют с другими. Сообщите врачу обо всех принимаемых лекарствах перед началом приема нового.",
            side_effects: "Побочные эффекты различаются в зависимости от лекарства. Прочтите медицинскую аннотацию и следите за любыми новыми симптомами."
        },
        emergencies: [
            "При медицинских чрезвычайных ситуациях немедленно звоните по номеру 123 или 115. Не ждите!",
            "В экстренном случае отправляйтесь в ближайшую больницу или вызовите скорую помощь по номеру 123."
        ]
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    
    setTimeout(() => {
        hidePreloader();
    }, 2000);
});

// ===== CORE FUNCTIONS =====
function initApp() {
    setLanguage('ru');
    
    if (localStorage.getItem('radko-pharm-theme')) {
        setTheme(localStorage.getItem('radko-pharm-theme'));
    }
    
    loadProducts();
    loadReviews();
    initCart();
    initAI();
    initEvents();
}

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('radko-pharm-lang', lang);
    
    document.body.classList.add('ltr');
    document.documentElement.dir = 'ltr';
    
    updateUI();
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('radko-pharm-theme', theme);
    
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        themeToggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function updateUI() {
    updateTexts();
    loadProducts();
    loadReviews();
    initAI();
}

function updateTexts() {
    const t = TRANSLATIONS[currentLang];
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (t[key]) element.textContent = t[key];
    });
    
    document.querySelectorAll('[data-placeholder]').forEach(element => {
        const key = element.dataset.placeholder;
        if (t[key]) element.placeholder = t[key];
    });
}

// ===== PRELOADER =====
function hidePreloader() {
    const preloader = document.querySelector('.preloader-3d');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => {
            if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 500);
    }
}

// ===== PRODUCTS =====
function loadProducts(category = 'all', search = '') {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    let filteredProducts = PRODUCTS;
    
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (search) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card-3d';
    card.dataset.id = product.id;
    
    const discountBadge = product.discount ? 
        `<div class="product-badge">-${product.discount}%</div>` : '';
    
    const originalPrice = product.originalPrice ? 
        `<span class="original-price">${product.originalPrice} ег.ф.</span>` : '';
    
    const rating = `
        <div class="product-rating">
            <div class="stars">
                ${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}
            </div>
            <span>(${product.reviews})</span>
        </div>
    `;
    
    card.innerHTML = `
        <div class="product-image-3d">
            ${product.image}
            ${discountBadge}
        </div>
        <div class="product-info-3d">
            <span class="product-category">${TRANSLATIONS[currentLang].categories[product.category]}</span>
            <h3 class="product-name-3d">${product.name}</h3>
            <p class="product-desc-3d">${product.description}</p>
            ${rating}
            <div class="product-meta">
                <div class="product-price">
                    ${originalPrice}
                    <span class="current-price">${product.price} ег.ф.</span>
                </div>
                <div class="product-stock">
                    <div class="stock-dot ${product.stock > 50 ? 'in-stock' : 'low-stock'}"></div>
                    <span>${product.stock > 50 ? 'В наличии' : 'Ограничено'}</span>
                </div>
            </div>
            <div class="product-actions-3d">
                <button class="action-btn add-cart-btn" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i>
                    ${TRANSLATIONS[currentLang].addToCart}
                </button>
                <button class="action-btn view-details-btn" data-id="${product.id}">
                    <i class="fas fa-eye"></i>
                    ${TRANSLATIONS[currentLang].viewDetails}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ===== CART =====
function initCart() {
    updateCartUI();
}

function addToCart(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
            showNotification('Требуемое количество недоступно', 'warning');
            return;
        }
        existingItem.quantity += quantity;
    } else {
        if (quantity > product.stock) {
            showNotification('Требуемое количество недоступно', 'warning');
            return;
        }
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${product.name} ${TRANSLATIONS[currentLang].addedToCart}`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification(TRANSLATIONS[currentLang].removedFromCart, 'info');
}

function saveCart() {
    localStorage.setItem('radko-pharm-cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    updateCartModal();
}

function updateCartModal() {
    const cartBody = document.getElementById('cart-body');
    if (!cartBody) return;
    
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>${TRANSLATIONS[currentLang].cartEmpty}</p>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let html = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    ${item.image}
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">${item.price} ег.ф. × ${item.quantity}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </div>
                <div class="cart-item-total">${itemTotal} ег.ф.</div>
            </div>
        `;
    });
    
    cartBody.innerHTML = html;
    
    const cartTotal = document.querySelector('.cart-total');
    const finalTotal = document.querySelector('.final-total');
    if (cartTotal) cartTotal.textContent = `${total} ег.ф.`;
    if (finalTotal) finalTotal.textContent = `${total} ег.ф.`;
}

// ===== AI CHAT =====
function initAI() {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;
    
    if (aiChatHistory.length === 0) {
        const welcomeMsg = AI_RESPONSES[currentLang].greetings[
            Math.floor(Math.random() * AI_RESPONSES[currentLang].greetings.length)
        ];
        addAIMessage(welcomeMsg);
    } else {
        aiChatHistory.forEach(msg => {
            if (msg.type === 'ai') {
                addAIMessage(msg.text, false);
            } else {
                addUserMessage(msg.text, false);
            }
        });
    }
}

function sendAIMessage() {
    const input = document.querySelector('.chat-input');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    addUserMessage(message);
    input.value = '';
    
    aiChatHistory.push({
        type: 'user',
        text: message,
        timestamp: new Date().toISOString()
    });
    
    const typingIndicator = addTypingIndicator();
    
    setTimeout(() => {
        typingIndicator.remove();
        const response = generateAIResponse(message);
        addAIMessage(response);
        
        aiChatHistory.push({
            type: 'ai',
            text: response,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('radko-pharm-chat', JSON.stringify(aiChatHistory));
    }, 1500);
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    const responses = AI_RESPONSES[currentLang];
    
    if (lowerMessage.includes('температура') || lowerMessage.includes('лихорадка')) {
        return responses.symptoms.fever;
    }
    
    if (lowerMessage.includes('головная') || lowerMessage.includes('головную')) {
        return responses.symptoms.headache;
    }
    
    if (lowerMessage.includes('кашель')) {
        return responses.symptoms.cough;
    }
    
    if (lowerMessage.includes('дозировка') || lowerMessage.includes('доза')) {
        return responses.medications.dosage;
    }
    
    if (lowerMessage.includes('взаимодействие') || lowerMessage.includes('совместимость')) {
        return responses.medications.interaction;
    }
    
    if (lowerMessage.includes('побочный') || lowerMessage.includes('побочные')) {
        return responses.medications.side_effects;
    }
    
    if (lowerMessage.includes('экстрен') || lowerMessage.includes('скорая')) {
        return responses.emergencies[Math.floor(Math.random() * responses.emergencies.length)];
    }
    
    const generalResponses = [
        "Это важный вопрос. Советую проконсультироваться с фармацевтом или врачом для точного диагноза.",
        "Я могу помочь вам с общей информацией, но для персональной медицинской консультации лучше обратиться к врачу.",
        "Можете предоставить больше деталей, чтобы я мог помочь вам лучше?"
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

function addUserMessage(text, animate = true) {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message user-message ${animate ? 'slide-in-left' : ''}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
        </div>
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
    `;
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addAIMessage(text, animate = true) {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ai-message ${animate ? 'slide-in-right' : ''}`;
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${text}</p>
        </div>
    `;
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addTypingIndicator() {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content typing">
            <div class="typing-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <span>${TRANSLATIONS[currentLang].aiTyping}</span>
        </div>
    `;
    
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    return typingDiv;
}

// ===== REVIEWS =====
function loadReviews() {
    const container = document.querySelector('.swiper-wrapper');
    if (!container) return;
    
    container.innerHTML = '';
    
    REVIEWS.forEach(review => {
        const reviewSlide = createReviewSlide(review);
        container.appendChild(reviewSlide);
    });
}

function createReviewSlide(review) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    
    const verifiedBadge = review.verified ? 
        '<span class="verified-review"><i class="fas fa-check-circle"></i> Проверенный покупатель</span>' : '';
    
    slide.innerHTML = `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-avatar">
                    <img src="${review.avatar}" alt="${review.name}">
                </div>
                <div class="reviewer-info">
                    <h4>${review.name}</h4>
                    ${verifiedBadge}
                    <div class="review-stars">
                        ${'★'.repeat(Math.floor(review.rating))}${review.rating % 1 ? '½' : ''}
                        <span>${review.rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>
            <div class="review-body">
                <p class="review-text">${review.text}</p>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
        </div>
    `;
    
    return slide;
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    const notificationCenter = document.getElementById('notification-center') || createNotificationCenter();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notificationCenter.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'times-circle';
        default: return 'info-circle';
    }
}

function createNotificationCenter() {
    const center = document.createElement('div');
    center.id = 'notification-center';
    center.className = 'notification-center';
    document.body.appendChild(center);
    return center;
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===== EVENT HANDLERS =====
function initEvents() {
    // Переключение темы
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }
    
    // Фильтрация продуктов
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            loadProducts(tag.dataset.category);
        });
    });
    
    // Поиск
    const searchInput = document.querySelector('.smart-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            loadProducts('all', e.target.value);
        });
    }
    
    // AI чат
    const sendBtn = document.getElementById('send-ai-message');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendAIMessage);
    }
    
    const chatInput = document.querySelector('.chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAIMessage();
            }
        });
    }
    
    // Корзина
    const cartQuick = document.getElementById('cart-quick');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.querySelector('.close-modal');
    
    if (cartQuick && cartModal) {
        cartQuick.addEventListener('click', () => {
            cartModal.classList.add('active');
        });
    }
    
    if (closeCart && cartModal) {
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }
    
    // Закрытие модалок
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-modal')) {
            e.target.classList.remove('active');
        }
        if (e.target.classList.contains('product-modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Делегирование событий
    document.addEventListener('click', (e) => {
        // Добавление в корзину
        if (e.target.closest('.add-cart-btn')) {
            const productId = parseInt(e.target.closest('.add-cart-btn').dataset.id);
            addToCart(productId);
        }
        
        // Просмотр деталей
        if (e.target.closest('.view-details-btn')) {
            const productId = parseInt(e.target.closest('.view-details-btn').dataset.id);
            showProductDetails(productId);
        }
        
        // Корзина: изменение количества
        if (e.target.closest('.increase')) {
            const productId = parseInt(e.target.closest('.increase').dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity < item.stock) {
                item.quantity++;
                saveCart();
                updateCartUI();
            }
        }
        
        if (e.target.closest('.decrease')) {
            const productId = parseInt(e.target.closest('.decrease').dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                item.quantity--;
                saveCart();
                updateCartUI();
            }
        }
        
        // Корзина: удаление
        if (e.target.closest('.remove-item')) {
            const productId = parseInt(e.target.closest('.remove-item').dataset.id);
            removeFromCart(productId);
        }
        
        // Оформление заказа
        if (e.target.closest('.checkout-btn')) {
            checkout();
        }
        
        // WhatsApp
        if (e.target.closest('.whatsapp-btn') || e.target.closest('#whatsapp-quick')) {
            openWhatsApp();
        }
        
        // Звонок
        if (e.target.closest('.call-btn') || e.target.closest('#call-quick')) {
            window.location.href = `tel:${CONFIG.OWNER.phone}`;
        }
    });
    
    // Прокрутка
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        });
    }
    
    // Форма обратной связи
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
            contactForm.reset();
        });
    }
}

// ===== ADDITIONAL FUNCTIONS =====
function showProductDetails(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const modalContent = modal.querySelector('.product-modal-content');
    
    const t = TRANSLATIONS[currentLang];
    
    modalContent.innerHTML = `
        <div class="product-detail-modal">
            <div class="product-detail-header">
                <div class="product-detail-image">
                    ${product.image}
                </div>
                <div class="product-detail-info">
                    <span class="product-category">${t.categories[product.category]}</span>
                    <h2>${product.name}</h2>
                    <div class="product-rating-large">
                        <div class="stars">${'★'.repeat(5)}</div>
                        <span>${product.rating} (${product.reviews} оценок)</span>
                    </div>
                </div>
            </div>
            
            <div class="product-detail-body">
                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> Описание</h3>
                    <p>${product.description}</p>
                </div>
                
                <div class="detail-grid">
                    <div class="detail-item">
                        <i class="fas fa-prescription-bottle-alt"></i>
                        <div>
                            <h4>Дозировка</h4>
                            <p>${product.dosage}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <h4>Побочные эффекты</h4>
                            <p>${product.sideEffects}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-pills"></i>
                        <div>
                            <h4>Требует рецепта</h4>
                            <p>${product.requiresPrescription ? 'Да' : 'Нет'}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-box"></i>
                        <div>
                            <h4>Наличие</h4>
                            <p>${product.stock} единиц</p>
                        </div>
                    </div>
                </div>
                
                <div class="product-detail-price">
                    ${product.originalPrice ? `
                        <span class="original-price">${product.originalPrice} ег.ф.</span>
                        <span class="discount">-${product.discount}%</span>
                    ` : ''}
                    <h3 class="current-price">${product.price} ег.ф.</h3>
                </div>
                
                <div class="product-detail-actions">
                    <button class="add-cart-btn-large" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i>
                        ${t.addToCart}
                    </button>
                    <button class="buy-now-btn" data-id="${product.id}">
                        <i class="fas fa-bolt"></i>
                        Купить сейчас
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    const addCartBtn = modalContent.querySelector('.add-cart-btn-large');
    const buyNowBtn = modalContent.querySelector('.buy-now-btn');
    
    if (addCartBtn) {
        addCartBtn.addEventListener('click', () => {
            addToCart(productId);
            modal.classList.remove('active');
        });
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            addToCart(productId, 1);
            modal.classList.remove('active');
            setTimeout(() => {
                document.querySelector('.cart-modal').classList.add('active');
            }, 300);
        });
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'warning');
        return;
    }
    
    let message = `Новый заказ из Radko-Pharm\n\n`;
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${index + 1}. ${item.name} × ${item.quantity} = ${itemTotal} ег.ф.\n`;
    });
    
    message += `\nИтого: ${total} ег.ф.\n`;
    message += `\nИмя клиента: __________\n`;
    message += `Адрес: __________\n`;
    message += `Телефон: __________\n`;
    message += `Способ оплаты: __________\n`;
    message += `Примечания: __________`;
    
    const whatsappUrl = `https://wa.me/${CONFIG.OWNER.phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    cart = [];
    saveCart();
    updateCartUI();
    showNotification('Заказ оформлен успешно', 'success');
}

function openWhatsApp() {
    const message = `Здравствуйте, хочу узнать о услугах Radko-Pharm`;
    const url = `https://wa.me/${CONFIG.OWNER.phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Экспорт для использования
window.RadkoPharm = {
    CONFIG,
    TRANSLATIONS,
    PRODUCTS,
    REVIEWS,
    setLanguage,
    setTheme,
    addToCart,
    removeFromCart,
    updateCart,
    showNotification
};