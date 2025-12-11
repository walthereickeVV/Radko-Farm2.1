// Система корзины Radko-Pharm
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('radko_cart')) || [];
        this.promoCode = localStorage.getItem('radko_promo') || null;
        this.promoApplied = JSON.parse(localStorage.getItem('radko_promo_applied')) || false;
        this.discount = 0;
        this.deliveryFee = CONFIG.CART.deliveryFee;
        this.taxRate = CONFIG.CART.taxRate;
        
        this.init();
    }
    
    init() {
        this.updateCartCount();
        this.calculateTotals();
    }
    
    // Добавление товара в корзину
    addItem(productId, quantity = 1) {
        const product = PRODUCTS_DB.getProductById(productId);
        if (!product) return false;
        
        // Проверка наличия
        if (product.stock < quantity) {
            this.showNotification(
                `В наличии только ${product.stock} единиц товара "${product.name[this.getCurrentLanguage()]}"`,
                'error'
            );
            return false;
        }
        
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity + quantity > product.stock) {
                this.showNotification(
                    `Нельзя добавить больше ${product.stock} единиц товара`,
                    'error'
                );
                return false;
            }
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.calculateTotals();
        this.showNotification(
            `${product.name[this.getCurrentLanguage()]} добавлен в корзину`,
            'success'
        );
        
        // Воспроизведение звука
        this.playSound('add');
        
        return true;
    }
    
    // Обновление количества товара
    updateQuantity(productId, newQuantity) {
        const product = PRODUCTS_DB.getProductById(productId);
        if (!product) return false;
        
        if (newQuantity < 1) {
            this.removeItem(productId);
            return true;
        }
        
        if (newQuantity > product.stock) {
            this.showNotification(
                `В наличии только ${product.stock} единиц товара`,
                'error'
            );
            return false;
        }
        
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.calculateTotals();
            return true;
        }
        
        return false;
    }
    
    // Удаление товара из корзины
    removeItem(productId) {
        const product = PRODUCTS_DB.getProductById(productId);
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.calculateTotals();
        
        if (product) {
            this.showNotification(
                `${product.name[this.getCurrentLanguage()]} удален из корзины`,
                'info'
            );
        }
        
        return true;
    }
    
    // Очистка корзины
    clearCart() {
        this.items = [];
        this.promoCode = null;
        this.promoApplied = false;
        this.discount = 0;
        this.saveCart();
        this.updateCartCount();
        this.calculateTotals();
        localStorage.removeItem('radko_promo');
        localStorage.removeItem('radko_promo_applied');
    }
    
    // Применение промокода
    applyPromoCode(code) {
        const promo = CONFIG.DISCOUNTS[code.toUpperCase()];
        
        if (!promo) {
            this.showNotification('Неверный промокод', 'error');
            return false;
        }
        
        this.promoCode = code.toUpperCase();
        this.promoApplied = true;
        localStorage.setItem('radko_promo', this.promoCode);
        localStorage.setItem('radko_promo_applied', 'true');
        
        this.calculateTotals();
        
        this.showNotification(
            `Промокод "${code}" применен успешно!`,
            'success'
        );
        
        return true;
    }
    
    // Удаление промокода
    removePromoCode() {
        this.promoCode = null;
        this.promoApplied = false;
        this.discount = 0;
        localStorage.removeItem('radko_promo');
        localStorage.removeItem('radko_promo_applied');
        this.calculateTotals();
        
        this.showNotification('Промокод удален', 'info');
    }
    
    // Расчет итогов
    calculateTotals() {
        const subtotal = this.getSubtotal();
        const discount = this.calculateDiscount(subtotal);
        const delivery = this.calculateDelivery(subtotal - discount);
        const tax = this.calculateTax(subtotal - discount);
        const total = subtotal - discount + delivery + tax;
        
        return {
            subtotal,
            discount,
            delivery,
            tax,
            total
        };
    }
    
    // Подсчет суммы товаров
    getSubtotal() {
        return this.items.reduce((total, item) => {
            const product = PRODUCTS_DB.getProductById(item.id);
            return total + (product?.price || 0) * item.quantity;
        }, 0);
    }
    
    // Расчет скидки
    calculateDiscount(subtotal) {
        if (!this.promoApplied || !this.promoCode) return 0;
        
        const promo = CONFIG.DISCOUNTS[this.promoCode];
        if (!promo) return 0;
        
        if (promo.type === 'percent') {
            return (subtotal * promo.value) / 100;
        } else if (promo.type === 'fixed') {
            return Math.min(promo.value, subtotal);
        }
        
        return 0;
    }
    
    // Расчет доставки
    calculateDelivery(subtotal) {
        if (subtotal >= CONFIG.CART.freeDelivery) {
            return 0;
        }
        return subtotal > 0 ? this.deliveryFee : 0;
    }
    
    // Расчет налога
    calculateTax(subtotal) {
        return subtotal * this.taxRate;
    }
    
    // Получение текущего языка
    getCurrentLanguage() {
        return localStorage.getItem('radko_lang') || 'ru';
    }
    
    // Обновление счетчика корзины
    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Обновляем бейдж на FAB
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
        
        // Обновляем счетчик в шапке
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = `(${count})`;
        }
        
        return count;
    }
    
    // Получение элементов корзины с полной информацией
    getCartItems() {
        return this.items.map(item => {
            const product = PRODUCTS_DB.getProductById(item.id);
            if (!product) return null;
            
            const lang = this.getCurrentLanguage();
            
            return {
                ...item,
                product: {
                    id: product.id,
                    name: product.name[lang],
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    requiresPrescription: product.requiresPrescription
                },
                total: product.price * item.quantity
            };
        }).filter(item => item !== null);
    }
    
    // Сохранение корзины в localStorage
    saveCart() {
        localStorage.setItem('radko_cart', JSON.stringify(this.items));
    }
    
    // Проверка минимального заказа
    checkMinOrder() {
        const subtotal = this.getSubtotal();
        return subtotal >= CONFIG.CART.minOrder;
    }
    
    // Получение рекомендаций для корзины
    getRecommendations() {
        const cartCategories = new Set();
        this.items.forEach(item => {
            const product = PRODUCTS_DB.getProductById(item.id);
            if (product) {
                cartCategories.add(product.category);
            }
        });
        
        // Получаем товары из тех же категорий, которых нет в корзине
        const recommendations = PRODUCTS_DB.products.filter(product => {
            return cartCategories.has(product.category) && 
                   !this.items.some(item => item.id === product.id);
        });
        
        // Сортируем по рейтингу и берем первые 5
        return recommendations
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
    }
    
    // Создание заказа
    createOrder(orderData) {
        const totals = this.calculateTotals();
        const items = this.getCartItems();
        
        const order = {
            id: 'ORD-' + Date.now(),
            date: new Date().toISOString(),
            customer: {
                name: orderData.name,
                phone: orderData.phone,
                email: orderData.email || '',
                address: orderData.address || '',
                notes: orderData.notes || ''
            },
            delivery: {
                method: orderData.deliveryMethod || 'express',
                address: orderData.address || '',
                time: orderData.deliveryTime || 'asap',
                fee: totals.delivery
            },
            payment: {
                method: orderData.paymentMethod || 'cash',
                status: 'pending'
            },
            items: items,
            totals: totals,
            promoCode: this.promoCode,
            status: 'new',
            estimatedDelivery: this.calculateDeliveryTime(orderData.deliveryMethod)
        };
        
        // Сохраняем заказ в историю
        this.saveOrderToHistory(order);
        
        // Очищаем корзину
        this.clearCart();
        
        return order;
    }
    
    // Расчет времени доставки
    calculateDeliveryTime(method) {
        const now = new Date();
        switch(method) {
            case 'express':
                now.setMinutes(now.getMinutes() + 30);
                break;
            case 'standard':
                now.setHours(now.getHours() + 2);
                break;
            default:
                now.setHours(now.getHours() + 1);
        }
        return now.toISOString();
    }
    
    // Сохранение заказа в историю
    saveOrderToHistory(order) {
        const history = JSON.parse(localStorage.getItem('radko_order_history')) || [];
        history.unshift(order);
        localStorage.setItem('radko_order_history', JSON.stringify(history.slice(0, 50))); // Храним последние 50 заказов
    }
    
    // Получение истории заказов
    getOrderHistory() {
        return JSON.parse(localStorage.getItem('radko_order_history')) || [];
    }
    
    // Показ уведомлений
    showNotification(message, type = 'info') {
        // Используем глобальную функцию showToast если она есть
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
    
    // Воспроизведение звуков
    playSound(type) {
        try {
            const audio = document.getElementById(`${type}-sound`);
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(e => console.log('Audio play failed:', e));
            }
        } catch (e) {
            console.log('Sound error:', e);
        }
    }
    
    // Генерация сообщения для WhatsApp
    generateWhatsAppMessage(orderData) {
        const lang = this.getCurrentLanguage();
        const items = this.getCartItems();
        const totals = this.calculateTotals();
        
        let message = '';
        
        if (lang === 'ru') {
            message = `📦 *Новый заказ из Radko-Pharm*\n\n`;
            message += `👤 *Клиент:* ${orderData.name}\n`;
            message += `📞 *Телефон:* ${orderData.phone}\n`;
            message += `📧 *Email:* ${orderData.email || 'не указан'}\n`;
            message += `📍 *Адрес:* ${orderData.address || 'самовывоз'}\n\n`;
            message += `🛒 *Заказ:*\n`;
            
            items.forEach((item, index) => {
                message += `${index + 1}. ${item.product.name} × ${item.quantity} = ${item.total} ${CONFIG.STORE.currency_symbol}\n`;
            });
            
            message += `\n💰 *Итого:*\n`;
            message += `Товары: ${totals.subtotal} ${CONFIG.STORE.currency_symbol}\n`;
            if (totals.discount > 0) {
                message += `Скидка: -${totals.discount} ${CONFIG.STORE.currency_symbol}\n`;
            }
            message += `Доставка: ${totals.delivery} ${CONFIG.STORE.currency_symbol}\n`;
            message += `Налог: ${totals.tax} ${CONFIG.STORE.currency_symbol}\n`;
            message += `*Всего: ${totals.total} ${CONFIG.STORE.currency_symbol}*\n\n`;
            message += `💳 *Оплата:* ${this.getPaymentMethodName(orderData.paymentMethod, lang)}\n`;
            message += `🚚 *Доставка:* ${this.getDeliveryMethodName(orderData.deliveryMethod, lang)}\n\n`;
            message += `📝 *Примечания:* ${orderData.notes || 'нет'}`;
            
        } else if (lang === 'ar') {
            message = `📦 *طلب جديد من Radko-Pharm*\n\n`;
            message += `👤 *العميل:* ${orderData.name}\n`;
            message += `📞 *الهاتف:* ${orderData.phone}\n`;
            message += `📧 *البريد:* ${orderData.email || 'غير محدد'}\n`;
            message += `📍 *العنوان:* ${orderData.address || 'استلام من المتجر'}\n\n`;
            message += `🛒 *الطلبات:*\n`;
            
            items.forEach((item, index) => {
                message += `${index + 1}. ${item.product.name} × ${item.quantity} = ${item.total} ${CONFIG.STORE.currency_symbol}\n`;
            });
            
            message += `\n💰 *الإجمالي:*\n`;
            message += `المنتجات: ${totals.subtotal} ${CONFIG.STORE.currency_symbol}\n`;
            if (totals.discount > 0) {
                message += `الخصم: -${totals.discount} ${CONFIG.STORE.currency_symbol}\n`;
            }
            message += `التوصيل: ${totals.delivery} ${CONFIG.STORE.currency_symbol}\n`;
            message += `الضريبة: ${totals.tax} ${CONFIG.STORE.currency_symbol}\n`;
            message += `*المجموع: ${totals.total} ${CONFIG.STORE.currency_symbol}*\n\n`;
            message += `💳 *الدفع:* ${this.getPaymentMethodName(orderData.paymentMethod, lang)}\n`;
            message += `🚚 *التوصيل:* ${this.getDeliveryMethodName(orderData.deliveryMethod, lang)}\n\n`;
            message += `📝 *ملاحظات:* ${orderData.notes || 'لا يوجد'}`;
            
        } else {
            message = `📦 *New Order from Radko-Pharm*\n\n`;
            message += `👤 *Customer:* ${orderData.name}\n`;
            message += `📞 *Phone:* ${orderData.phone}\n`;
            message += `📧 *Email:* ${orderData.email || 'not specified'}\n`;
            message += `📍 *Address:* ${orderData.address || 'pickup'}\n\n`;
            message += `🛒 *Order:*\n`;
            
            items.forEach((item, index) => {
                message += `${index + 1}. ${item.product.name} × ${item.quantity} = ${item.total} ${CONFIG.STORE.currency_symbol}\n`;
            });
            
            message += `\n💰 *Total:*\n`;
            message += `Products: ${totals.subtotal} ${CONFIG.STORE.currency_symbol}\n`;
            if (totals.discount > 0) {
                message += `Discount: -${totals.discount} ${CONFIG.STORE.currency_symbol}\n`;
            }
            message += `Delivery: ${totals.delivery} ${CONFIG.STORE.currency_symbol}\n`;
            message += `Tax: ${totals.tax} ${CONFIG.STORE.currency_symbol}\n`;
            message += `*Total: ${totals.total} ${CONFIG.STORE.currency_symbol}*\n\n`;
            message += `💳 *Payment:* ${this.getPaymentMethodName(orderData.paymentMethod, lang)}\n`;
            message += `🚚 *Delivery:* ${this.getDeliveryMethodName(orderData.deliveryMethod, lang)}\n\n`;
            message += `📝 *Notes:* ${orderData.notes || 'none'}`;
        }
        
        return encodeURIComponent(message);
    }
    
    getPaymentMethodName(method, lang) {
        const names = {
            cash: { ru: "Наличные", ar: "نقدي", en: "Cash" },
            card: { ru: "Карта онлайн", ar: "بطاقة اونلاين", en: "Online Card" },
            vodafone: { ru: "Vodafone Cash", ar: "فودافون كاش", en: "Vodafone Cash" }
        };
        return names[method]?.[lang] || method;
    }
    
    getDeliveryMethodName(method, lang) {
        const names = {
            express: { ru: "Экспресс (30 мин)", ar: "إكسبريس (30 دقيقة)", en: "Express (30 min)" },
            standard: { ru: "Стандартная (2 часа)", ar: "قياسي (ساعتين)", en: "Standard (2 hours)" },
            pickup: { ru: "Самовывоз", ar: "استلام من المتجر", en: "Pickup" }
        };
        return names[method]?.[lang] || method;
    }
}

// Инициализация глобального объекта корзины
let cart = null;

document.addEventListener('DOMContentLoaded', function() {
    cart = new ShoppingCart();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoppingCart;
} else {
    window.ShoppingCart = ShoppingCart;
}