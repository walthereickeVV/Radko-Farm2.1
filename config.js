// Конфигурация приложения Radko-Pharm
const CONFIG = {
    // Основные настройки
    APP_NAME: "Radko-Pharm",
    APP_VERSION: "2.0.0",
    APP_YEAR: "2025",
    
    // Настройки владельца
    OWNER: {
        name: "Раед Махмуд Хейри Ахмед",
        name_ar: "رائد محمود خيري أحمد",
        name_en: "Raed Mahmoud Kheiry Ahmed",
        phone: "+201275929754",
        email: "raed@radkopharm.com",
        license: "JT5179743",
        address: "Эль-Ашрин, Египет",
        address_ar: "العشرين، مصر",
        address_en: "El-Ashreen, Egypt"
    },
    
    // Настройки магазина
    STORE: {
        name: "Radko-Pharm",
        tagline: "Умная аптека премиум-класса",
        tagline_ar: "صيدلية ذكية فاخرة",
        tagline_en: "Premium Smart Pharmacy",
        phone: "+201275929754",
        email: "info@radkopharm.com",
        address: "Эль-Ашрин, Египет",
        working_hours: "24/7",
        delivery_time: "30 минут",
        currency: "EGP",
        currency_symbol: "ег.ф."
    },
    
    // API ключи и эндпоинты
    API: {
        baseUrl: "https://api.radkopharm.com",
        aiEndpoint: "/api/v1/ai/chat",
        productsEndpoint: "/api/v1/products",
        ordersEndpoint: "/api/v1/orders",
        analyticsEndpoint: "/api/v1/analytics"
    },
    
    // Настройки AI
    AI: {
        name: "Dr. DeepSeek",
        welcomeMessages: [
            "Здравствуйте! Я ваш AI-помощник в аптеке Radko-Pharm. Чем могу помочь?",
            "Привет! Я Dr. DeepSeek, ваш виртуальный консультант по лекарствам.",
            "Здравствуйте! Готов помочь с вопросами о лекарствах и здоровье."
        ],
        responses: {
            dosage: "Рекомендованная дозировка указана в инструкции. Для точного назначения проконсультируйтесь с врачом.",
            side_effects: "Возможные побочные эффекты включают... Обратитесь к фармацевту за подробной информацией.",
            interaction: "Перед совмещением лекарств проконсультируйтесь с врачом для проверки совместимости.",
            alternative: "У нас есть аналоги этого препарата. Укажите предпочтения по цене или производителю."
        }
    },
    
    // Настройки корзины
    CART: {
        taxRate: 0.14, // 14% налог
        deliveryFee: 30, // Стоимость доставки
        minOrder: 50, // Минимальный заказ
        freeDelivery: 500 // Бесплатная доставка от
    },
    
    // Скидки и промокоды
    DISCOUNTS: {
        WELCOME10: { code: "WELCOME10", value: 10, type: "percent" },
        FIRSTORDER: { code: "FIRSTORDER", value: 15, type: "percent" },
        RADKO25: { code: "RADKO25", value: 25, type: "fixed" }
    },
    
    // Настройки уведомлений
    NOTIFICATIONS: {
        cartAdd: true,
        orderStatus: true,
        reminders: true,
        promotions: true
    },
    
    // Социальные сети
    SOCIAL: {
        whatsapp: "https://wa.me/201275929754",
        facebook: "https://facebook.com/radkopharm",
        instagram: "https://instagram.com/radkopharm",
        twitter: "https://twitter.com/radkopharm",
        linkedin: "https://linkedin.com/company/radkopharm",
        youtube: "https://youtube.com/@radkopharm"
    },
    
    // Настройки темы
    THEME: {
        primary: "#00C897",
        secondary: "#667eea",
        accent: "#FF6B6B",
        dark: "#1A1A2E",
        light: "#F8F9FA"
    },
    
    // Функции
    FEATURES: {
        aiConsultant: true,
        digitalPharmacy: true,
        voiceSearch: true,
        prescriptionScan: true,
        healthMonitoring: true,
        subscriptionService: true
    }
};

// Экспорт конфигурации
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}