// База данных товаров (продолжение)
const products = [
    {
        id: 1,
        name: "Амоксициллин 500 мг",
        category: "antibiotics",
        description: "Антибиотик широкого спектра",
        price: 85,
        image: "💊",
        stock: 150
    },
    {
        id: 2,
        name: "Парацетамол 500 мг",
        category: "painkillers",
        description: "Обезболивающее и жаропонижающее",
        price: 25,
        image: "💊",
        stock: 500
    },
    {
        id: 3,
        name: "Витамин C 1000 мг",
        category: "vitamins",
        description: "Для укрепления иммунитета",
        price: 45,
        image: "💊",
        stock: 200
    },
    {
        id: 4,
        name: "Ибупрофен 400 мг",
        category: "painkillers",
        description: "Противовоспалительное средство",
        price: 35,
        image: "💊",
        stock: 300
    },
    {
        id: 5,
        name: "Метформин 850 мг",
        category: "chronic",
        description: "Для лечения диабета",
        price: 65,
        image: "💊",
        stock: 120
    },
    {
        id: 6,
        name: "Омепразол 20 мг",
        category: "chronic",
        description: "От изжоги и язвы желудка",
        price: 75,
        image: "💊",
        stock: 180
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('radko-cart')) || [];

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Скрыть прелоадер
    setTimeout(() => {
        document.getElementById('preloader').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 1000);
    
    // Загрузить товары
    loadProducts();
    
    // Загрузить корзину
    updateCart();
    
    // Инициализировать события
    initEvents();
});

// Загрузка товаров
function loadProducts(filter = 'all') {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

// Создание карточки товара
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <div class="product-image">
            ${product.image}
        </div>
        <div class="product-info">
            <span class="product-category">${getCategoryName(product.category)}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            <div class="product-price">${product.price} ег.ф.</div>
            <div class="product-actions">
                <button class="product-btn add-cart" data-id="${product.id}">
                    В корзину
                </button>
                <button class="product-btn view-details" data-id="${product.id}">
                    Подробнее
                </button>
            </div>
        </div>
    `;
    return div;
}

// Названия категорий
function getCategoryName(category) {
    const categories = {
        'antibiotics': 'Антибиотики',
        'painkillers': 'Обезболивающие',
        'vitamins': 'Витамины',
        'chronic': 'Хронические болезни'
    };
    return categories[category] || category;
}

// Обновление корзины
function updateCart() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
    
    updateCartSidebar();
}

// Обновление боковой панели корзины
function updateCartSidebar() {
    const container = document.getElementById('cart-items');
    const totalElem = document.getElementById('cart-total');
    
    if (!container || !totalElem) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        totalElem.textContent = '0 ег.ф.';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.image}
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${item.price} ег.ф. × ${item.quantity}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Удалить</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    totalElem.textContent = `${total} ег.ф.`;
}

// Добавление в корзину
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        if (existing.quantity + quantity <= product.stock) {
            existing.quantity += quantity;
        } else {
            showNotification('Недостаточно товара в наличии', 'error');
            return;
        }
    } else {
        if (quantity <= product.stock) {
            cart.push({
                ...product,
                quantity: quantity
            });
        } else {
            showNotification('Недостаточно товара в наличии', 'error');
            return;
        }
    }
    
    saveCart();
    updateCart();
    showNotification(`${product.name} добавлен в корзину`, 'success');
}

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
    showNotification('Товар удален из корзины', 'info');
}

// Сохранение корзины
function saveCart() {
    localStorage.setItem('radko-cart', JSON.stringify(cart));
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">✕</button>
        </div>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Закрытие по клику
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        margin-left: 15px;
        cursor: pointer;
        font-size: 1.2rem;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;
document.head.appendChild(style);

// AI Консультант
const aiResponses = [
    "Здравствуйте! Я Dr. DeepSeek. Как я могу помочь вам сегодня?",
    "Для определения точной дозировки лучше проконсультироваться с фармацевтом.",
    "Побочные эффекты зависят от лекарства. Прочтите инструкцию или спросите у фармацевта.",
    "Перед приемом новых лекарств проконсультируйтесь с врачом о возможных взаимодействиях.",
    "При высокой температуре рекомендуется постельный режим и обильное питье.",
    "Если симптомы сохраняются более 3 дней, обратитесь к врачу.",
    "Это предварительная консультация. Для точного диагноза обратитесь к специалисту."
];

// Инициализация событий
function initEvents() {
    // Меню
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
    
    // Фильтрация товаров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadProducts(this.dataset.filter);
        });
    });
    
    // Корзина
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });
    }
    
    if (closeCartBtn && cartSidebar) {
        closeCartBtn.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }
    
    // Закрытие корзины при клике вне ее
    document.addEventListener('click', (e) => {
        if (cartSidebar && 
            cartSidebar.classList.contains('active') && 
            !cartSidebar.contains(e.target) && 
            !cartBtn.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    });
    
    // Делегирование событий
    document.addEventListener('click', function(e) {
        // Добавление в корзину
        if (e.target.closest('.add-cart')) {
            const productId = parseInt(e.target.closest('.add-cart').dataset.id);
            addToCart(productId);
        }
        
        // Корзина: изменение количества
        if (e.target.closest('.increase')) {
            const productId = parseInt(e.target.closest('.increase').dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item) {
                const product = products.find(p => p.id === productId);
                if (item.quantity < product.stock) {
                    item.quantity++;
                    saveCart();
                    updateCart();
                }
            }
        }
        
        if (e.target.closest('.decrease')) {
            const productId = parseInt(e.target.closest('.decrease').dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                item.quantity--;
                saveCart();
                updateCart();
            }
        }
        
        // Корзина: удаление
        if (e.target.closest('.remove-item')) {
            const productId = parseInt(e.target.closest('.remove-item').dataset.id);
            removeFromCart(productId);
        }
        
        // Кнопки действий
        if (e.target.closest('#consult-btn')) {
            document.querySelector('#ai-doctor').scrollIntoView({ behavior: 'smooth' });
        }
        
        if (e.target.closest('#products-btn')) {
            document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Оформление заказа
        if (e.target.closest('#checkout-btn')) {
            if (cart.length === 0) {
                showNotification('Корзина пуста', 'error');
                return;
            }
            
            let message = 'Новый заказ из Radko-Pharm:\n\n';
            let total = 0;
            
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                message += `${index + 1}. ${item.name} × ${item.quantity} = ${itemTotal} ег.ф.\n`;
            });
            
            message += `\nИтого: ${total} ег.ф.\n`;
            message += `\nИмя: __________\n`;
            message += `Адрес: __________\n`;
            message += `Телефон: __________\n`;
            message += `Способ оплаты: __________\n`;
            
            const whatsappUrl = `https://wa.me/201275929754?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            cart = [];
            saveCart();
            updateCart();
            cartSidebar.classList.remove('active');
            showNotification('Заказ оформлен! Проверьте WhatsApp', 'success');
        }
    });
    
    // AI Чат
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (sendBtn && messageInput && chatMessages) {
        // Отправка сообщения
        const sendMessage = () => {
            const message = messageInput.value.trim();
            if (!message) return;
            
            // Добавляем сообщение пользователя
            const userMsg = document.createElement('div');
            userMsg.className = 'message user';
            userMsg.innerHTML = `
                <div class="content">
                    <p>${message}</p>
                </div>
                <div class="avatar">👤</div>
            `;
            chatMessages.appendChild(userMsg);
            
            // Очищаем поле
            messageInput.value = '';
            
            // Прокручиваем вниз
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Имитируем ответ AI
            setTimeout(() => {
                const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                
                const aiMsg = document.createElement('div');
                aiMsg.className = 'message ai';
                aiMsg.innerHTML = `
                    <div class="avatar">🤖</div>
                    <div class="content">
                        <p>${randomResponse}</p>
                    </div>
                `;
                chatMessages.appendChild(aiMsg);
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        };
        
        // Отправка по кнопке
        sendBtn.addEventListener('click', sendMessage);
        
        // Отправка по Enter
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Быстрые вопросы
        document.querySelectorAll('.quick-questions button').forEach(btn => {
            btn.addEventListener('click', function() {
                const question = this.dataset.question;
                messageInput.value = `Вопрос о ${question}`;
                sendMessage();
            });
        });
    }
    
    // Плавная прокрутка для навигации
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
    
    // Анимация чисел статистики
    const animateNumbers = () => {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + '+';
                }
            }, 20);
        });
    };
    
    // Запускаем анимацию при появлении
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Сохранение в localStorage
window.addEventListener('beforeunload', () => {
    saveCart();
});

// Экспорт для отладки
window.RadkoPharm = {
    cart,
    products,
    addToCart,
    removeFromCart,
    updateCart
};