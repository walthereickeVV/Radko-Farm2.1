// Основной скрипт Radko-Pharm
class RadkoPharmApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupPreloader();
        this.setupEventListeners();
        this.setupAnimations();
        this.setupSnowflakes();
        this.setupFAB();
        this.setupHeader();
        this.setupProducts();
        this.setupVideo();
        this.setupScrollAnimations();
        this.setupNotifications();
        this.setupTheme();
        this.setupServiceWorker();
        
        console.log('🚀 Radko-Pharm v2.0.0 initialized');
    }
    
    // Настройка прелоадера
    setupPreloader() {
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            this.showToast('Добро пожаловать в Radko-Pharm!', 'success');
        }, 2000);
    }
    
    // Настройка снежинок для декора
    setupSnowflakes() {
        const container = document.getElementById('snowflakes');
        if (!container) return;
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Создаем снежинки
        for (let i = 0; i < 30; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            
            // Случайный размер
            const size = Math.random() * 10 + 5;
            snowflake.style.width = `${size}px`;
            snowflake.style.height = `${size}px`;
            
            // Случайная позиция
            snowflake.style.left = `${Math.random() * 100}%`;
            
            // Случайная задержка
            snowflake.style.animationDelay = `${Math.random() * 5}s`;
            
            // Случайная продолжительность анимации
            const duration = Math.random() * 10 + 10;
            snowflake.style.animationDuration = `${duration}s`;
            
            // Случайная прозрачность
            snowflake.style.opacity = Math.random() * 0.3 + 0.1;
            
            container.appendChild(snowflake);
        }
    }
    
    // Настройка плавающей кнопки действий
    setupFAB() {
        const mainFab = document.querySelector('.main-fab');
        const fabMenu = document.querySelector('.fab-menu');
        
        if (!mainFab || !fabMenu) return;
        
        mainFab.addEventListener('click', () => {
            fabMenu.classList.toggle('active');
            mainFab.classList.toggle('active');
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', (e) => {
            if (!fabMenu.contains(e.target) && !mainFab.contains(e.target)) {
                fabMenu.classList.remove('active');
                mainFab.classList.remove('active');
            }
        });
    }
    
    // Настройка шапки
    setupHeader() {
        const header = document.getElementById('header');
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', () => {
                mainNav.classList.toggle('active');
            });
        }
        
        // Плавное появление шапки при скролле
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    mainNav.classList.remove('active');
                }
            });
        });
    }
    
    // Настройка товаров
    setupProducts() {
        this.renderProducts();
        this.setupProductFilters();
        this.setupProductSearch();
    }
    
    // Отрисовка товаров
    renderProducts() {
        const container = document.getElementById('products-grid');
        if (!container) return;
        
        const lang = localStorage.getItem('radko_lang') || 'ru';
        const products = PRODUCTS_DB.getProducts();
        
        container.innerHTML = products.map(product => {
            const category = PRODUCTS_DB.getCategory(product.category);
            const ratingStars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
            
            return `
                <div class="product-card ${PRODUCTS_DB.popular.includes(product.id) ? 'featured' : ''}">
                    <div class="product-image">
                        ${product.image}
                        ${product.requiresPrescription ? '<span class="product-badge">💊 Рецепт</span>' : ''}
                    </div>
                    <div class="product-info">
                        <span class="product-category" style="background: ${category.color}">
                            <i class="${category.icon}"></i> ${category.name[lang]}
                        </span>
                        <h3 class="product-name">${product.name[lang]}</h3>
                        <p class="product-desc">${product.description[lang]}</p>
                        
                        <div class="product-rating">
                            <span class="stars">${ratingStars}</span>
                            <span class="rating-count">(${product.reviews})</span>
                        </div>
                        
                        <div class="product-price">
                            <span class="price-current">${product.price} ${CONFIG.STORE.currency_symbol}</span>
                            ${product.oldPrice ? `<span class="price-old">${product.oldPrice} ${CONFIG.STORE.currency_symbol}</span>` : ''}
                        </div>
                        
                        <div class="product-stock">
                            <span class="stock-label">В наличии:</span>
                            <span class="stock-count ${product.stock < 20 ? 'low' : ''}">
                                ${product.stock} шт.
                            </span>
                        </div>
                        
                        <div class="product-actions">
                            <button class="product-btn primary add-to-cart" data-id="${product.id}">
                                <i class="fas fa-cart-plus"></i> В корзину
                            </button>
                            <button class="product-btn secondary view-details" data-id="${product.id}">
                                <i class="fas fa-info-circle"></i> Подробнее
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Добавляем обработчики событий
        this.setupProductEvents();
    }
    
    // Настройка фильтров товаров
    setupProductFilters() {
        const filterBtns = document.querySelectorAll('.filter-tab');
        const sortSelect = document.getElementById('sort-select');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Убираем активный класс у всех кнопок
                filterBtns.forEach(b => b.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                btn.classList.add('active');
                
                // Фильтруем товары
                this.filterProducts(btn.getAttribute('data-filter'));
            });
        });
        
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.sortProducts(sortSelect.value);
            });
        }
    }
    
    // Фильтрация товаров
    filterProducts(filter) {
        const products = PRODUCTS_DB.getProducts(filter);
        this.updateProductsGrid(products);
    }
    
    // Сортировка товаров
    sortProducts(sort) {
        const currentFilter = document.querySelector('.filter-tab.active')?.getAttribute('data-filter') || 'all';
        const products = PRODUCTS_DB.getProducts(currentFilter, sort);
        this.updateProductsGrid(products);
    }
    
    // Обновление сетки товаров
    updateProductsGrid(products) {
        // В реальном приложении здесь была бы полная перерисовка
        console.log('Updating products grid with', products.length, 'products');
    }
    
    // Настройка поиска товаров
    setupProductSearch() {
        const searchInput = document.getElementById('product-search');
        const searchAI = document.querySelector('.search-ai');
        
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                
                searchTimeout = setTimeout(() => {
                    const query = e.target.value.trim();
                    if (query.length >= 2) {
                        this.searchProducts(query);
                    } else if (query.length === 0) {
                        this.renderProducts();
                    }
                }, 300);
            });
        }
        
        if (searchAI) {
            searchAI.addEventListener('click', () => {
                this.showToast('AI поиск скоро будет доступен!', 'info');
            });
        }
    }
    
    // Поиск товаров
    searchProducts(query) {
        const lang = localStorage.getItem('radko_lang') || 'ru';
        const filtered = PRODUCTS_DB.products.filter(product => 
            product.name[lang].toLowerCase().includes(query.toLowerCase()) ||
            product.description[lang].toLowerCase().includes(query.toLowerCase())
        );
        
        this.updateProductsGrid(filtered);
    }
    
    // Настройка обработчиков событий товаров
    setupProductEvents() {
        // Добавление в корзину
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-id'));
                if (cart) {
                    cart.addItem(productId);
                }
            });
        });
        
        // Просмотр деталей
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-id'));
                this.showProductDetails(productId);
            });
        });
    }
    
    // Показ деталей товара
    showProductDetails(productId) {
        const product = PRODUCTS_DB.getProductById(productId);
        if (!product) return;
        
        const lang = localStorage.getItem('radko_lang') || 'ru';
        
        // В реальном приложении здесь было бы модальное окно
        let details = `
            🏷️ ${product.name[lang]}
            💰 ${product.price} ${CONFIG.STORE.currency_symbol}
            📦 ${product.stock} шт. в наличии
            ${product.requiresPrescription ? '💊 Требуется рецепт' : '💊 Без рецепта'}
            ⭐ Рейтинг: ${product.rating}/5 (${product.reviews} отзывов)
            
            ${product.description[lang]}
        `;
        
        alert(details);
    }
    
    // Настройка видео
    setupVideo() {
        const watchBtn = document.getElementById('watch-video');
        const videoPopup = document.getElementById('video-popup');
        const closeVideo = document.querySelector('.close-video');
        
        if (watchBtn && videoPopup) {
            watchBtn.addEventListener('click', () => {
                videoPopup.classList.add('active');
            });
            
            closeVideo.addEventListener('click', () => {
                videoPopup.classList.remove('active');
            });
            
            // Закрытие при клике вне видео
            videoPopup.addEventListener('click', (e) => {
                if (e.target === videoPopup) {
                    videoPopup.classList.remove('active');
                }
            });
        }
    }
    
    // Настройка анимаций при скролле
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Анимация чисел статистики
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Наблюдаем за элементами с анимацией
        document.querySelectorAll('.stat-number, .service-card, .review-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Анимация счетчиков
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count') || element.textContent);
        const suffix = element.textContent.includes('%') ? '%' : '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (suffix === '%') {
                element.textContent = `${Math.floor(current)}${suffix}`;
            } else {
                element.textContent = `${Math.floor(current)}+`;
            }
        }, 16);
    }
    
    // Настройка уведомлений
    setupNotifications() {
        // Глобальная функция для показа тостов
        window.showToast = (message, type = 'info') => {
            const container = document.getElementById('toast-container');
            if (!container) return;
            
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            
            const icons = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                warning: 'fas fa-exclamation-triangle',
                info: 'fas fa-info-circle'
            };
            
            toast.innerHTML = `
                <i class="${icons[type] || icons.info}"></i>
                <span class="toast-message">${message}</span>
                <div class="toast-progress"></div>
            `;
            
            container.appendChild(toast);
            
            // Удаляем тост через 5 секунд
            setTimeout(() => {
                toast.style.animation = 'slideOutUp 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        };
    }
    
    // Настройка темы
    setupTheme() {
        // Сохранение темы в localStorage
        const theme = localStorage.getItem('radko_theme') || 'light';
        document.body.classList.toggle('dark-theme', theme === 'dark');
        
        // Кнопка переключения темы (если будет добавлена)
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDark = document.body.classList.toggle('dark-theme');
                localStorage.setItem('radko_theme', isDark ? 'dark' : 'light');
                this.showToast(`Тема изменена на ${isDark ? 'темную' : 'светлую'}`, 'success');
            });
        }
    }
    
    // Настройка Service Worker
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful:', registration.scope);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }
    }
    
    // Настройка анимаций
    setupAnimations() {
        // Анимация появления элементов
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('animated');
                }
            });
        };
        
        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Запускаем сразу
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Быстрая консультация
        const consultBtn = document.getElementById('consult-free');
        if (consultBtn) {
            consultBtn.addEventListener('click', () => {
                document.querySelector('#ai-doctor').scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Исследовать каталог
        const exploreBtn = document.getElementById('explore-products');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Быстрый заказ
        const quickOrderBtn = document.getElementById('quick-order-btn');
        if (quickOrderBtn) {
            quickOrderBtn.addEventListener('click', () => {
                this.openQuickOrderModal();
            });
        }
        
        // Написать отзыв
        const writeReviewBtn = document.getElementById('write-review');
        if (writeReviewBtn) {
            writeReviewBtn.addEventListener('click', () => {
                this.openReviewModal();
            });
        }
        
        // Горячие клавиши
        document.addEventListener('keydown', (e) => {
            // Ctrl + / для поиска
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                const searchInput = document.getElementById('product-search');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Esc для закрытия модальных окон
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Обработка отправки форм
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }
    
    // Открытие модального окна быстрого заказа
    openQuickOrderModal() {
        const modal = document.getElementById('whatsapp-modal');
        if (!modal) return;
        
        // Генерируем содержимое заказа
        const orderContent = modal.querySelector('.whatsapp-order');
        if (orderContent && cart) {
            const items = cart.getCartItems();
            const totals = cart.calculateTotals();
            
            let html = '<ul>';
            items.forEach(item => {
                html += `<li>${item.product.name} × ${item.quantity} = ${item.total} ${CONFIG.STORE.currency_symbol}</li>`;
            });
            html += '</ul>';
            html += `<p><strong>Итого: ${totals.total} ${CONFIG.STORE.currency_symbol}</strong></p>`;
            
            orderContent.innerHTML = html;
            
            // Обновляем ссылку WhatsApp
            const whatsappBtn = document.getElementById('send-whatsapp');
            if (whatsappBtn) {
                const orderData = {
                    name: 'Быстрый заказ',
                    phone: '',
                    notes: 'Быстрый заказ через сайт'
                };
                
                const message = cart.generateWhatsAppMessage(orderData);
                whatsappBtn.href = `https://wa.me/${CONFIG.STORE.phone}?text=${message}`;
            }
        }
        
        modal.classList.add('active');
    }
    
    // Открытие модального окна отзыва
    openReviewModal() {
        this.showToast('Форма отзыва скоро будет доступна!', 'info');
    }
    
    // Закрытие всех модальных окон
    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    // Обработка отправки форм
    handleFormSubmit(form) {
        const formId = form.id;
        
        switch(formId) {
            case 'contact-form':
                this.handleContactForm(form);
                break;
            case 'checkout-form':
                this.handleCheckoutForm(form);
                break;
            default:
                console.log('Form submitted:', formId);
        }
    }
    
    // Обработка формы контактов
    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // В реальном приложении здесь был бы отправка на сервер
        console.log('Contact form data:', data);
        
        this.showToast('Сообщение отправлено! Мы ответим в течение 15 минут.', 'success');
        form.reset();
    }
    
    // Обработка формы оформления заказа
    handleCheckoutForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // В реальном приложении здесь была бы сложная логика оформления заказа
        console.log('Checkout form data:', data);
        
        if (cart) {
            const order = cart.createOrder(data);
            this.showToast(`Заказ #${order.id} оформлен успешно!`, 'success');
            this.closeAllModals();
        }
    }
    
    // Показ уведомления
    showToast(message, type = 'info') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        }
    }
}

// Инициализация приложения
let app = null;

document.addEventListener('DOMContentLoaded', function() {
    app = new RadkoPharmApp();
    
    // Глобальные функции для отладки
    window.debug = {
        products: PRODUCTS_DB,
        config: CONFIG,
        cart: cart,
        ai: aiConsultant,
        pharmacy: digitalPharmacy,
        i18n: i18n,
        app: app
    };
    
    console.log('🔧 Отладка доступна через window.debug');
});

// Обработка события изменения языка
window.addEventListener('languageChanged', function() {
    // Перерисовываем товары при смене языка
    if (app) {
        app.renderProducts();
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RadkoPharmApp;
} else {
    window.RadkoPharmApp = RadkoPharmApp;
}