// Многоязычная поддержка Radko-Pharm
class I18n {
    constructor() {
        this.currentLang = this.getSavedLanguage() || this.detectLanguage();
        this.translations = {};
        this.loaded = false;
        
        this.init();
    }
    
    init() {
        this.loadTranslations().then(() => {
            this.applyLanguage();
            this.setupEventListeners();
            this.loaded = true;
        });
    }
    
    // Получение сохраненного языка
    getSavedLanguage() {
        return localStorage.getItem('radko_lang');
    }
    
    // Сохранение языка
    saveLanguage(lang) {
        localStorage.setItem('radko_lang', lang);
        this.currentLang = lang;
    }
    
    // Определение языка браузера
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        
        // Поддерживаемые языки
        const supported = ['ru', 'ar', 'en'];
        
        // Проверяем основной язык
        const mainLang = browserLang.split('-')[0];
        if (supported.includes(mainLang)) {
            return mainLang;
        }
        
        // Проверяем полный код языка
        if (supported.includes(browserLang)) {
            return browserLang;
        }
        
        // Язык по умолчанию
        return 'ru';
    }
    
    // Загрузка переводов
    async loadTranslations() {
        try {
            // В реальном приложении здесь был бы fetch к JSON файлу
            this.translations = {
                ru: this.getRussianTranslations(),
                ar: this.getArabicTranslations(),
                en: this.getEnglishTranslations()
            };
        } catch (error) {
            console.error('Error loading translations:', error);
            this.translations = {
                ru: this.getRussianTranslations(),
                ar: this.getArabicTranslations(),
                en: this.getEnglishTranslations()
            };
        }
    }
    
    // Применение языка
    applyLanguage() {
        // Устанавливаем атрибут lang для HTML
        document.documentElement.lang = this.currentLang;
        
        // Устанавливаем направление текста для арабского
        if (this.currentLang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl');
        }
        
        // Обновляем все элементы с data-i18n
        this.updateAllElements();
        
        // Обновляем кнопки переключателя языка
        this.updateLanguageButtons();
        
        // Обновляем мета-теги
        this.updateMetaTags();
        
        // Сохраняем язык
        this.saveLanguage(this.currentLang);
        
        // Вызываем события изменения языка
        this.triggerLanguageChange();
    }
    
    // Обновление всех элементов с переводами
    updateAllElements() {
        // Элементы с data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.get(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
                    element.alt = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });
        
        // Элементы с data-i18n-attr
        document.querySelectorAll('[data-i18n-attr]').forEach(element => {
            const attr = element.getAttribute('data-i18n-attr');
            const key = element.getAttribute(`data-i18n-${attr}`);
            const translation = this.get(key);
            
            if (translation) {
                element.setAttribute(attr, translation);
            }
        });
        
        // Элементы с data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.get(key);
            
            if (translation) {
                element.title = translation;
            }
        });
    }
    
    // Обновление кнопок переключателя языка
    updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            
            if (lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Обновление мета-тегов
    updateMetaTags() {
        // Обновляем title если есть data-i18n-title
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n');
            const translation = this.get(key);
            if (translation) {
                document.title = translation;
            }
        }
        
        // Обновляем meta description
        const metaDesc = document.querySelector('meta[name="description"][data-i18n]');
        if (metaDesc) {
            const key = metaDesc.getAttribute('data-i18n');
            const translation = this.get(key);
            if (translation) {
                metaDesc.content = translation;
            }
        }
    }
    
    // Получение перевода по ключу
    get(key, params = {}) {
        if (!key) return '';
        
        let translation = this.translations[this.currentLang];
        
        // Ищем перевод по пути (например, "nav.home")
        const keys = key.split('.');
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Если перевод не найден, пробуем английский
                if (this.currentLang !== 'en') {
                    translation = this.translations.en;
                    for (const k2 of keys) {
                        if (translation && translation[k2]) {
                            translation = translation[k2];
                        } else {
                            return key; // Возвращаем ключ если перевод не найден
                        }
                    }
                } else {
                    return key; // Возвращаем ключ если перевод не найден
                }
            }
        }
        
        // Заменяем параметры если они есть
        if (typeof translation === 'string' && Object.keys(params).length > 0) {
            translation = this.replaceParams(translation, params);
        }
        
        return translation;
    }
    
    // Замена параметров в строке
    replaceParams(text, params) {
        let result = text;
        
        Object.keys(params).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, params[key]);
        });
        
        return result;
    }
    
    // Установка языка
    setLanguage(lang) {
        if (lang !== this.currentLang && ['ru', 'ar', 'en'].includes(lang)) {
            this.currentLang = lang;
            this.applyLanguage();
            
            // Показываем уведомление
            this.showNotification(this.get('language_changed'), 'success');
        }
    }
    
    // Переключение языка
    toggleLanguage() {
        const languages = ['ru', 'ar', 'en'];
        const currentIndex = languages.indexOf(this.currentLang);
        const nextIndex = (currentIndex + 1) % languages.length;
        this.setLanguage(languages[nextIndex]);
    }
    
    // Событие изменения языка
    triggerLanguageChange() {
        const event = new CustomEvent('languageChanged', {
            detail: { lang: this.currentLang }
        });
        window.dispatchEvent(event);
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Кнопки переключения языка
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
        
        // Горячая клавиша для переключения языка (Ctrl+Shift+L)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.toggleLanguage();
            }
        });
    }
    
    // Показать уведомление
    showNotification(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        }
    }
    
    // Получение переводов для русского
    getRussianTranslations() {
        return {
            // Навигация
            nav_home: "Главная",
            nav_products: "Товары",
            nav_ai: "AI Доктор",
            nav_services: "Услуги",
            nav_pharmacy: "Моя аптечка",
            nav_contact: "Контакты",
            
            // Герой
            pharmacy_subtitle: "Умная аптека премиум-класса",
            working_hours: "24/7 Без выходных",
            delivery_time: "Доставка 30 мин",
            hero_title: "Аптека будущего уже здесь",
            hero_subtitle: "Первая AI-аптека премиум-класса в Египте с виртуальным консультантом, цифровой аптечкой и экспресс-доставкой 24/7",
            stat_products: "Препаратов",
            stat_customers: "Довольных клиентов",
            stat_delivery: "Доставка вовремя",
            btn_consult_free: "Бесплатная консультация",
            btn_explore: "Исследовать каталог",
            btn_watch: "Смотреть видео",
            
            // Владелец
            owner_title: "Основатель и владелец",
            owner_subtitle: "Лицензированный фармацевт с 15-летним опытом",
            owner_position: "Владелец и главный фармацевт",
            education: "Образование",
            education_text: "Доктор фармацевтических наук",
            experience: "Опыт",
            experience_text: "15+ лет в фармации",
            license: "Лицензия",
            owner_quote: "Ваше здоровье — наша миссия. Мы сочетаем современные технологии с человеческой заботой.",
            
            // Товары
            products_title: "Премиум каталог",
            products_subtitle: "Только оригинальные препараты с сертификатами",
            search_placeholder: "Поиск препаратов...",
            search_ai: "AI Поиск",
            sort_popular: "Популярные",
            sort_price_asc: "Цена ↑",
            sort_price_desc: "Цена ↓",
            sort_new: "Новинки",
            quick_order_title: "Не нашли нужное лекарство?",
            quick_order_text: "Закажите через нашего AI-консультанта",
            btn_quick_order: "Быстрый заказ",
            
            // AI Консультант
            ai_title: "Dr. DeepSeek AI",
            ai_subtitle: "Ваш персональный медицинский помощник 24/7",
            ai_name: "Dr. DeepSeek",
            ai_status: "Онлайн • Готов помочь",
            ai_conversations: "Консультаций",
            ai_accuracy: "Точность",
            ai_features: "Возможности",
            ai_diagnosis: "Предварительная диагностика",
            ai_interaction: "Проверка совместимости",
            ai_dosage: "Расчет дозировки",
            ai_reminder: "Напоминания о приеме",
            ai_voice: "Голосовой режим",
            chat_title: "Чат с AI-доктором",
            chat_placeholder: "Опишите симптомы или задайте вопрос...",
            quick_dosage: "Дозировка",
            quick_side: "Побочные эффекты",
            quick_interaction: "Совместимость",
            quick_alternative: "Аналоги",
            
            // Цифровая аптечка
            pharmacy_title: "Моя цифровая аптечка",
            pharmacy_subtitle: "Управляйте вашими лекарствами в одном месте",
            btn_edit_profile: "Редактировать",
            pharmacy_meds: "Лекарств",
            pharmacy_reminders: "Напоминаний",
            pharmacy_refill: "Пополнить",
            pharmacy_add: "Добавить лекарство",
            pharmacy_import: "Импорт рецепта",
            pharmacy_export: "Экспорт данных",
            tab_current: "Текущие",
            tab_history: "История",
            tab_reminders: "Напоминания",
            tab_reports: "Отчеты",
            empty_meds_title: "Аптечка пуста",
            empty_meds_text: "Добавьте ваши лекарства для отслеживания",
            btn_add_first: "Добавить первое лекарство",
            
            // Услуги
            services_title: "Эксклюзивные услуги",
            services_subtitle: "Мы предлагаем больше, чем просто аптека",
            service_express: "Экспресс-доставка",
            service_express_desc: "Доставка за 30 минут в любое время суток",
            feature_30min: "30 минут гарантия",
            feature_track: "Отслеживание в реальном времени",
            feature_247: "24/7 доступность",
            btn_order_express: "Заказать сейчас",
            service_consult: "Виртуальная консультация",
            service_consult_desc: "Консультация с фармацевтом по видеосвязи",
            feature_video: "Видеоконсультация",
            feature_prescription: "Электронный рецепт",
            feature_followup: "Последующее наблюдение",
            btn_book_consult: "Записаться",
            service_personal: "Персональная аптечка",
            service_personal_desc: "Индивидуальный набор лекарств на месяц",
            feature_packaging: "Индивидуальная фасовка",
            feature_delivery: "Ежемесячная доставка",
            feature_adjust: "Корректировка по необходимости",
            btn_create_kit: "Создать набор",
            service_lab: "Лабораторные анализы",
            service_lab_desc: "Забор анализов на дому с быстрыми результатами",
            feature_home: "Забор на дому",
            feature_digital: "Цифровые результаты",
            feature_consult: "Консультация по результатам",
            btn_order_test: "Заказать анализы",
            service_monitoring: "Мониторинг здоровья",
            service_monitoring_desc: "Ежедневный мониторинг жизненных показателей",
            feature_vitals: "Контроль показателей",
            feature_alerts: "Автооповещение врача",
            feature_report: "Еженедельный отчет",
            btn_start_monitor: "Начать мониторинг",
            service_subscription: "Лекарства по подписке",
            service_subscription_desc: "Автоматическая доставка регулярных лекарств",
            feature_auto: "Автодозаказ",
            feature_discount: "Скидка 15%",
            feature_pause: "Возможность паузы",
            btn_subscribe: "Оформить подписку",
            
            // Отзывы
            reviews_title: "Отзывы клиентов",
            reviews_subtitle: "Что говорят наши клиенты",
            rating_based: "На основе 1,247 отзывов",
            review_1: "Лучшая аптека в Египте! AI-консультант помог подобрать альтернативу дорогому лекарству. Доставка заняла всего 25 минут в 3 часа ночи!",
            review_2: "Цифровая аптечка спасла меня! Напоминания не дают забыть о приеме лекарств. Очень удобно отслеживать историю приема.",
            review_3: "Заказывал лекарства для бабушки. Консультант подробно объяснил как принимать, даже позвонил для уточнений. Очень внимательный сервис!",
            btn_write_review: "Написать отзыв",
            btn_view_all: "Смотреть все отзывы",
            
            // Контакты
            contact_title: "Наши контакты",
            contact_subtitle: "Мы всегда на связи",
            contact_address: "Адрес",
            contact_note: "Бесплатная парковка для клиентов",
            contact_phone: "Телефон",
            contact_24: "Круглосуточная поддержка",
            contact_email: "Email",
            contact_hours: "Часы работы",
            hours_247: "24 часа в сутки, 7 дней в неделю",
            hours_holidays: "Без выходных и праздников",
            map_loading: "Загрузка карты...",
            map_directions: "Как добраться",
            btn_directions: "Проложить маршрут",
            form_title: "Остались вопросы?",
            form_subtitle: "Напишите нам, и мы ответим в течение 15 минут",
            form_name: "Имя",
            form_phone: "Телефон",
            form_subject: "Тема",
            form_select: "Выберите тему",
            form_consult: "Консультация",
            form_order: "Заказ",
            form_delivery: "Доставка",
            form_complaint: "Жалоба",
            form_suggestion: "Предложение",
            form_message: "Сообщение",
            btn_send_message: "Отправить сообщение",
            form_note: "Нажимая кнопку, вы соглашаетесь с обработкой персональных данных",
            
            // Подвал
            footer_tagline: "Аптека будущего сегодня",
            footer_description: "Первая AI-аптека премиум-класса в Египте, сочетающая передовые технологии с человеческой заботой.",
            footer_services: "Услуги",
            footer_express: "Экспресс-доставка",
            footer_consult: "Консультации",
            footer_pharmacy: "Цифровая аптечка",
            footer_lab: "Анализы",
            footer_info: "Информация",
            footer_about: "О компании",
            footer_blog: "Блог",
            footer_career: "Карьера",
            footer_partners: "Партнеры",
            footer_legal: "Правовая информация",
            footer_terms: "Условия использования",
            footer_privacy: "Политика конфиденциальности",
            footer_cookies: "Cookies",
            footer_compliance: "Соответствие",
            footer_app: "Скачайте приложение",
            footer_app_desc: "Полный функционал в вашем телефоне",
            app_store: "Download on the",
            play_store: "Get it on",
            footer_scan: "Отсканируйте для загрузки",
            footer_payments: "Принимаем к оплате:",
            footer_rights: "Все права защищены.",
            footer_license: "Лицензия:",
            footer_vat: "НДС:",
            footer_owner: "Владелец: Раед Махмуд Хейри Ахмед",
            badge_secure: "SSL защищено",
            badge_certified: "Сертифицировано",
            
            // Корзина
            cart_title: "Корзина",
            cart_empty_title: "Корзина пуста",
            cart_empty_text: "Добавьте товары из каталога",
            btn_browse: "Перейти в каталог",
            cart_recommend: "С этим покупают",
            cart_subtotal: "Промежуточный итог",
            cart_delivery: "Доставка",
            cart_discount: "Скидка",
            cart_total: "Итого",
            cart_promo_placeholder: "Промокод",
            btn_apply: "Применить",
            btn_continue: "Продолжить покупки",
            btn_checkout: "Оформить заказ",
            
            // Оформление заказа
            checkout_title: "Оформление заказа",
            step_info: "Информация",
            step_delivery: "Доставка",
            step_payment: "Оплата",
            step_confirm: "Подтверждение",
            form_name: "Имя",
            form_phone: "Телефон",
            form_notes: "Примечания к заказу",
            delivery_express: "Экспресс доставка",
            delivery_express_desc: "Доставка в течение 30 минут",
            badge_popular: "Популярно",
            delivery_standard: "Стандартная",
            delivery_standard_desc: "Доставка в течение 2 часов",
            delivery_pickup: "Самовывоз",
            delivery_pickup_desc: "Заберите в аптеке",
            form_address: "Адрес доставки",
            form_time: "Время доставки",
            time_asap: "Как можно скорее",
            time_specific: "Конкретное время",
            form_date: "Дата",
            payment_cash: "Наличные",
            payment_cash_desc: "Оплата при получении",
            payment_card: "Карта онлайн",
            payment_card_desc: "Безопасная оплата картой",
            payment_vodafone: "Vodafone Cash",
            payment_vodafone_desc: "Оплата через Vodafone",
            card_number: "Номер карты",
            card_expiry: "Срок действия",
            card_cvv: "CVV",
            card_name: "Имя на карте",
            order_summary: "Сводка заказа",
            order_total: "Итого к оплате:",
            confirm_terms: "Я соглашаюсь с условиями обслуживания и политикой конфиденциальности",
            confirm_marketing: "Хочу получать новости и специальные предложения",
            btn_prev: "Назад",
            btn_next: "Далее",
            btn_place_order: "Подтвердить заказ",
            
            // WhatsApp заказ
            whatsapp_title: "Быстрый заказ через WhatsApp",
            whatsapp_desc: "Ваш заказ будет отправлен в WhatsApp для быстрого оформления. Наш оператор свяжется с вами в течение 2 минут.",
            btn_send_whatsapp: "Отправить в WhatsApp",
            btn_cancel: "Отмена",
            
            // Общие
            btn_save: "Сохранить",
            btn_cancel: "Отмена",
            loading: "Загрузка...",
            error: "Ошибка",
            success: "Успешно",
            warning: "Внимание",
            info: "Информация",
            
            // Языки
            language_changed: "Язык изменен",
            
            // Статусы
            status_online: "Онлайн: 154 чел.",
            status_orders: "Доставляем: 23 заказа",
            status_ai: "AI активен",
            
            // Время
            time_just_now: "Только что",
            time_minutes_ago: "мин. назад",
            time_hours_ago: "ч. назад",
            
            // Пользователь
            user_default_name: "Пользователь"
        };
    }
    
    // Получение переводов для арабского
    getArabicTranslations() {
        return {
            // Навигация
            nav_home: "الرئيسية",
            nav_products: "المنتجات",
            nav_ai: "الذكاء الاصطناعي",
            nav_services: "الخدمات",
            nav_pharmacy: "صيدليتي",
            nav_contact: "اتصل بنا",
            
            // Герой
            pharmacy_subtitle: "صيدلية ذكية فاخرة",
            working_hours: "٢٤/٧ بدون عطلات",
            delivery_time: "توصيل ٣٠ دقيقة",
            hero_title: "صيدلية المستقبل هنا الآن",
            hero_subtitle: "أول صيدلية ذكاء اصطناعي فاخرة في مصر مع مستشار افتراضي، صيدلية رقمية وتوصيل إكسبريس ٢٤/٧",
            stat_products: "منتج",
            stat_customers: "عميل راضٍ",
            stat_delivery: "توصيل في الوقت",
            btn_consult_free: "استشارة مجانية",
            btn_explore: "استعرض الكتالوج",
            btn_watch: "شاهد الفيديو",
            
            // Владелец
            owner_title: "المؤسس والمالك",
            owner_subtitle: "صيدلي مرخص مع ١٥ سنة خبرة",
            owner_position: "المالك والصيدلي الرئيسي",
            education: "التعليم",
            education_text: "دكتور في العلوم الصيدلانية",
            experience: "الخبرة",
            experience_text: "١٥+ سنة في الصيدلة",
            license: "الترخيص",
            owner_quote: "صحتكم هي مهمتنا. نجمع بين التكنولوجيا الحديثة والرعاية البشرية.",
            
            // Товары
            products_title: "كتالوج فاخر",
            products_subtitle: "أدوية أصلية فقط مع شهادات",
            search_placeholder: "بحث الأدوية...",
            search_ai: "بحث بالذكاء الاصطناعي",
            sort_popular: "الأكثر شيوعًا",
            sort_price_asc: "السعر ↑",
            sort_price_desc: "السعر ↓",
            sort_new: "الجديد",
            quick_order_title: "لم تجد الدواء المطلوب؟",
            quick_order_text: "اطلب من خلال مستشار الذكاء الاصطناعي",
            btn_quick_order: "طلب سريع",
            
            // AI Консультант
            ai_title: "دكتور DeepSeek الذكي",
            ai_subtitle: "مساعدك الطبي الشخصي ٢٤/٧",
            ai_name: "دكتور DeepSeek",
            ai_status: "متصل • جاهز للمساعدة",
            ai_conversations: "استشارة",
            ai_accuracy: "الدقة",
            ai_features: "الميزات",
            ai_diagnosis: "تشخيص أولي",
            ai_interaction: "فحص التوافق",
            ai_dosage: "حساب الجرعة",
            ai_reminder: "تذكير بالجرعات",
            ai_voice: "الوضع الصوتي",
            chat_title: "محادثة مع دكتور الذكاء الاصطناعي",
            chat_placeholder: "صف الأعراض أو اطرح سؤالًا...",
            quick_dosage: "الجرعة",
            quick_side: "الآثار الجانبية",
            quick_interaction: "التوافق",
            quick_alternative: "بدائل",
            
            // Цифровая аптечка
            pharmacy_title: "صيدليتي الرقمية",
            pharmacy_subtitle: "إدارة أدويتك في مكان واحد",
            btn_edit_profile: "تعديل",
            pharmacy_meds: "أدوية",
            pharmacy_reminders: "تذكيرات",
            pharmacy_refill: "إعادة تعبئة",
            pharmacy_add: "إضافة دواء",
            pharmacy_import: "استيراد روشتة",
            pharmacy_export: "تصدير البيانات",
            tab_current: "الحالية",
            tab_history: "السجل",
            tab_reminders: "التذكيرات",
            tab_reports: "التقارير",
            empty_meds_title: "الصيدلية فارغة",
            empty_meds_text: "أضف أدويتك للمتابعة",
            btn_add_first: "إضافة أول دواء",
            
            // Услуги
            services_title: "خدمات حصرية",
            services_subtitle: "نقدم أكثر من مجرد صيدلية",
            service_express: "توصيل إكسبريس",
            service_express_desc: "توصيل خلال ٣٠ دقيقة في أي وقت",
            feature_30min: "ضمان ٣٠ دقيقة",
            feature_track: "تتبع في الوقت الحقيقي",
            feature_247: "متاحة ٢٤/٧",
            btn_order_express: "اطلب الآن",
            service_consult: "استشارة افتراضية",
            service_consult_desc: "استشارة مع صيدلي عبر الفيديو",
            feature_video: "استشارة فيديو",
            feature_prescription: "روشتة إلكترونية",
            feature_followup: "متابعة",
            btn_book_consult: "احجز",
            service_personal: "صيدلية شخصية",
            service_personal_desc: "مجموعة أدوية فردية لمدة شهر",
            feature_packaging: "تعبئة فردية",
            feature_delivery: "توصيل شهري",
            feature_adjust: "تعديل حسب الحاجة",
            btn_create_kit: "إنشاء مجموعة",
            service_lab: "تحاليل معملية",
            service_lab_desc: "سحب عينات في المنزل مع نتائج سريعة",
            feature_home: "سحب في المنزل",
            feature_digital: "نتائج رقمية",
            feature_consult: "استشارة بالنتائج",
            btn_order_test: "طلب تحاليل",
            service_monitoring: "مراقبة الصحة",
            service_monitoring_desc: "مراقبة يومية للمؤشرات الحيوية",
            feature_vitals: "مراقبة المؤشرات",
            feature_alerts: "إشعار تلقائي للطبيب",
            feature_report: "تقرير أسبوعي",
            btn_start_monitor: "ابدأ المراقبة",
            service_subscription: "أدوية باشتراك",
            service_subscription_desc: "توصيل تلقائي للأدوية المنتظمة",
            feature_auto: "طلب تلقائي",
            feature_discount: "خصم ١٥٪",
            feature_pause: "إمكانية الإيقاف",
            btn_subscribe: "اشترك",
            
            // Отзывы
            reviews_title: "آراء العملاء",
            reviews_subtitle: "ماذا يقول عملاؤنا",
            rating_based: "بناءً على ١,٢٤٧ رأي",
            review_1: "أفضل صيدلية في مصر! مستشار الذكاء الاصطناعي ساعد في إيجاد بديل للدواء باهظ الثمن. التوصيل استغرق ٢٥ دقيقة فقط في الثالثة صباحًا!",
            review_2: "الصيدلية الرقمية أنقذتني! التذكيرات تمنعني من نسيان تناول الأدوية. مريح جدًا تتبع تاريخ الأدوية.",
            review_3: "طلبت أدوية لجدتي. المستشار شرح بالتفصيل كيفية الاستخدام، حتى اتصل للتوضيح. خدمة جدًا مهتمة!",
            btn_write_review: "كتابة رأي",
            btn_view_all: "عرض جميع الآراء",
            
            // Контакты
            contact_title: "اتصل بنا",
            contact_subtitle: "نحن دائمًا على اتصال",
            contact_address: "العنوان",
            contact_note: "موقف سيارات مجاني للعملاء",
            contact_phone: "الهاتف",
            contact_24: "دعم على مدار الساعة",
            contact_email: "البريد الإلكتروني",
            contact_hours: "ساعات العمل",
            hours_247: "٢٤ ساعة يوميًا، ٧ أيام أسبوعيًا",
            hours_holidays: "بدون عطلات أو إجازات",
            map_loading: "جاري تحميل الخريطة...",
            map_directions: "كيفية الوصول",
            btn_directions: "تحديد المسار",
            form_title: "هل لديك أسئلة؟",
            form_subtitle: "اكتب لنا وسنرد خلال ١٥ دقيقة",
            form_name: "الاسم",
            form_phone: "الهاتف",
            form_subject: "الموضوع",
            form_select: "اختر الموضوع",
            form_consult: "استشارة",
            form_order: "طلب",
            form_delivery: "توصيل",
            form_complaint: "شكوى",
            form_suggestion: "اقتراح",
            form_message: "الرسالة",
            btn_send_message: "إرسال الرسالة",
            form_note: "بالضغط على الزر، أنت توافق على معالجة البيانات الشخصية",
            
            // Подвал
            footer_tagline: "صيدلية المستقبل اليوم",
            footer_description: "أول صيدلية ذكاء اصطناعي فاخرة في مصر، تجمع بين التكنولوجيا المتقدمة والرعاية البشرية.",
            footer_services: "الخدمات",
            footer_express: "توصيل إكسبريس",
            footer_consult: "استشارات",
            footer_pharmacy: "صيدلية رقمية",
            footer_lab: "تحاليل",
            footer_info: "معلومات",
            footer_about: "عن الشركة",
            footer_blog: "المدونة",
            footer_career: "الوظائف",
            footer_partners: "الشركاء",
            footer_legal: "معلومات قانونية",
            footer_terms: "شروط الاستخدام",
            footer_privacy: "سياسة الخصوصية",
            footer_cookies: "الكوكيز",
            footer_compliance: "الامتثال",
            footer_app: "حمّل التطبيق",
            footer_app_desc: "وظائف كاملة في هاتفك",
            app_store: "حمّل من",
            play_store: "احصل عليه من",
            footer_scan: "امسح للتحميل",
            footer_payments: "نقبل الدفع بـ:",
            footer_rights: "جميع الحقوق محفوظة.",
            footer_license: "الترخيص:",
            footer_vat: "الضريبة:",
            footer_owner: "المالك: رائد محمود خيري أحمد",
            badge_secure: "محمول بـ SSL",
            badge_certified: "معتمد",
            
            // Корзина
            cart_title: "عربة التسوق",
            cart_empty_title: "عربة التسوق فارغة",
            cart_empty_text: "أضف منتجات من الكتالوج",
            btn_browse: "انتقل إلى الكتالوج",
            cart_recommend: "يشترون مع هذا",
            cart_subtotal: "المجموع الجزئي",
            cart_delivery: "التوصيل",
            cart_discount: "الخصم",
            cart_total: "الإجمالي",
            cart_promo_placeholder: "كود الخصم",
            btn_apply: "تطبيق",
            btn_continue: "متابعة التسوق",
            btn_checkout: "إتمام الطلب",
            
            // Оформление заказа
            checkout_title: "إتمام الطلب",
            step_info: "المعلومات",
            step_delivery: "التوصيل",
            step_payment: "الدفع",
            step_confirm: "التأكيد",
            form_name: "الاسم",
            form_phone: "الهاتف",
            form_notes: "ملاحظات على الطلب",
            delivery_express: "توصيل إكسبريس",
            delivery_express_desc: "توصيل خلال ٣٠ دقيقة",
            badge_popular: "شائع",
            delivery_standard: "قياسي",
            delivery_standard_desc: "توصيل خلال ساعتين",
            delivery_pickup: "استلام من المتجر",
            delivery_pickup_desc: "استلم من الصيدلية",
            form_address: "عنوان التوصيل",
            form_time: "وقت التوصيل",
            time_asap: "في أقرب وقت ممكن",
            time_specific: "وقت محدد",
            form_date: "التاريخ",
            payment_cash: "نقدي",
            payment_cash_desc: "الدفع عند الاستلام",
            payment_card: "بطاقة اونلاين",
            payment_card_desc: "دفع آمن بالبطاقة",
            payment_vodafone: "فودافون كاش",
            payment_vodafone_desc: "الدفع عبر فودافون",
            card_number: "رقم البطاقة",
            card_expiry: "تاريخ الانتهاء",
            card_cvv: "CVV",
            card_name: "الاسم على البطاقة",
            order_summary: "ملخص الطلب",
            order_total: "المجموع للدفع:",
            confirm_terms: "أوافق على شروط الخدمة وسياسة الخصوصية",
            confirm_marketing: "أرغب في تلقي الأخبار والعروض الخاصة",
            btn_prev: "السابق",
            btn_next: "التالي",
            btn_place_order: "تأكيد الطلب",
            
            // WhatsApp заказ
            whatsapp_title: "طلب سريع عبر واتساب",
            whatsapp_desc: "سيتم إرسال طلبك إلى واتساب للمعالجة السريعة. سيتصل بك مندوبنا خلال دقيقتين.",
            btn_send_whatsapp: "إرسال إلى واتساب",
            btn_cancel: "إلغاء",
            
            // Общие
            btn_save: "حفظ",
            btn_cancel: "إلغاء",
            loading: "جاري التحميل...",
            error: "خطأ",
            success: "نجاح",
            warning: "تحذير",
            info: "معلومات",
            
            // Языки
            language_changed: "تم تغيير اللغة",
            
            // Статусы
            status_online: "متصلون: ١٥٤ شخص",
            status_orders: "نقوم بالتوصيل: ٢٣ طلب",
            status_ai: "الذكاء الاصطناعي نشط",
            
            // Время
            time_just_now: "الآن",
            time_minutes_ago: "دقيقة",
            time_hours_ago: "ساعة",
            
            // Пользователь
            user_default_name: "المستخدم"
        };
    }
    
    // Получение переводов для английского
    getEnglishTranslations() {
        return {
            // Navigation
            nav_home: "Home",
            nav_products: "Products",
            nav_ai: "AI Doctor",
            nav_services: "Services",
            nav_pharmacy: "My Pharmacy",
            nav_contact: "Contact",
            
            // Hero
            pharmacy_subtitle: "Premium Smart Pharmacy",
            working_hours: "24/7 No Days Off",
            delivery_time: "30 Min Delivery",
            hero_title: "Pharmacy of the Future is Here",
            hero_subtitle: "First AI-powered premium pharmacy in Egypt with virtual consultant, digital medicine cabinet, and 24/7 express delivery",
            stat_products: "Products",
            stat_customers: "Satisfied Customers",
            stat_delivery: "Delivery on Time",
            btn_consult_free: "Free Consultation",
            btn_explore: "Explore Catalog",
            btn_watch: "Watch Video",
            
            // Owner
            owner_title: "Founder & Owner",
            owner_subtitle: "Licensed Pharmacist with 15 Years Experience",
            owner_position: "Owner & Chief Pharmacist",
            education: "Education",
            education_text: "Doctor of Pharmaceutical Sciences",
            experience: "Experience",
            experience_text: "15+ Years in Pharmacy",
            license: "License",
            owner_quote: "Your health is our mission. We combine modern technology with human care.",
            
            // Products
            products_title: "Premium Catalog",
            products_subtitle: "Only original medicines with certificates",
            search_placeholder: "Search medicines...",
            search_ai: "AI Search",
            sort_popular: "Popular",
            sort_price_asc: "Price ↑",
            sort_price_desc: "Price ↓",
            sort_new: "New",
            quick_order_title: "Didn't find the medicine you need?",
            quick_order_text: "Order through our AI consultant",
            btn_quick_order: "Quick Order",
            
            // AI Consultant
            ai_title: "Dr. DeepSeek AI",
            ai_subtitle: "Your Personal Medical Assistant 24/7",
            ai_name: "Dr. DeepSeek",
            ai_status: "Online • Ready to Help",
            ai_conversations: "Consultations",
            ai_accuracy: "Accuracy",
            ai_features: "Features",
            ai_diagnosis: "Preliminary Diagnosis",
            ai_interaction: "Compatibility Check",
            ai_dosage: "Dosage Calculation",
            ai_reminder: "Medication Reminders",
            ai_voice: "Voice Mode",
            chat_title: "Chat with AI Doctor",
            chat_placeholder: "Describe symptoms or ask a question...",
            quick_dosage: "Dosage",
            quick_side: "Side Effects",
            quick_interaction: "Compatibility",
            quick_alternative: "Alternatives",
            
            // Digital Pharmacy
            pharmacy_title: "My Digital Pharmacy",
            pharmacy_subtitle: "Manage your medications in one place",
            btn_edit_profile: "Edit",
            pharmacy_meds: "Medications",
            pharmacy_reminders: "Reminders",
            pharmacy_refill: "Refill",
            pharmacy_add: "Add Medication",
            pharmacy_import: "Import Prescription",
            pharmacy_export: "Export Data",
            tab_current: "Current",
            tab_history: "History",
            tab_reminders: "Reminders",
            tab_reports: "Reports",
            empty_meds_title: "Pharmacy is Empty",
            empty_meds_text: "Add your medications for tracking",
            btn_add_first: "Add First Medication",
            
            // Services
            services_title: "Exclusive Services",
            services_subtitle: "We offer more than just a pharmacy",
            service_express: "Express Delivery",
            service_express_desc: "Delivery within 30 minutes anytime",
            feature_30min: "30 minutes guarantee",
            feature_track: "Real-time tracking",
            feature_247: "24/7 availability",
            btn_order_express: "Order Now",
            service_consult: "Virtual Consultation",
            service_consult_desc: "Consultation with pharmacist via video",
            feature_video: "Video consultation",
            feature_prescription: "Electronic prescription",
            feature_followup: "Follow-up",
            btn_book_consult: "Book Now",
            service_personal: "Personal Pharmacy",
            service_personal_desc: "Individual medication set for a month",
            feature_packaging: "Individual packaging",
            feature_delivery: "Monthly delivery",
            feature_adjust: "Adjustment as needed",
            btn_create_kit: "Create Kit",
            service_lab: "Laboratory Tests",
            service_lab_desc: "Home sample collection with fast results",
            feature_home: "Home collection",
            feature_digital: "Digital results",
            feature_consult: "Results consultation",
            btn_order_test: "Order Tests",
            service_monitoring: "Health Monitoring",
            service_monitoring_desc: "Daily monitoring of vital signs",
            feature_vitals: "Vitals monitoring",
            feature_alerts: "Auto-alert to doctor",
            feature_report: "Weekly report",
            btn_start_monitor: "Start Monitoring",
            service_subscription: "Medication Subscription",
            service_subscription_desc: "Automatic delivery of regular medications",
            feature_auto: "Auto-order",
            feature_discount: "15% discount",
            feature_pause: "Pause option",
            btn_subscribe: "Subscribe",
            
            // Reviews
            reviews_title: "Customer Reviews",
            reviews_subtitle: "What our customers say",
            rating_based: "Based on 1,247 reviews",
            review_1: "Best pharmacy in Egypt! AI consultant helped find an alternative to expensive medicine. Delivery took only 25 minutes at 3 AM!",
            review_2: "Digital pharmacy saved me! Reminders prevent me from forgetting to take medications. Very convenient to track medication history.",
            review_3: "Ordered medicines for my grandmother. Consultant explained in detail how to take, even called for clarifications. Very attentive service!",
            btn_write_review: "Write Review",
            btn_view_all: "View All Reviews",
            
            // Contacts
            contact_title: "Our Contacts",
            contact_subtitle: "We are always in touch",
            contact_address: "Address",
            contact_note: "Free parking for customers",
            contact_phone: "Phone",
            contact_24: "24/7 support",
            contact_email: "Email",
            contact_hours: "Working Hours",
            hours_247: "24 hours a day, 7 days a week",
            hours_holidays: "No weekends or holidays",
            map_loading: "Loading map...",
            map_directions: "How to get there",
            btn_directions: "Get Directions",
            form_title: "Have questions?",
            form_subtitle: "Write to us and we'll reply within 15 minutes",
            form_name: "Name",
            form_phone: "Phone",
            form_subject: "Subject",
            form_select: "Select subject",
            form_consult: "Consultation",
            form_order: "Order",
            form_delivery: "Delivery",
            form_complaint: "Complaint",
            form_suggestion: "Suggestion",
            form_message: "Message",
            btn_send_message: "Send Message",
            form_note: "By clicking the button, you agree to the processing of personal data",
            
            // Footer
            footer_tagline: "Pharmacy of the Future Today",
            footer_description: "First AI-powered premium pharmacy in Egypt, combining advanced technology with human care.",
            footer_services: "Services",
            footer_express: "Express Delivery",
            footer_consult: "Consultations",
            footer_pharmacy: "Digital Pharmacy",
            footer_lab: "Tests",
            footer_info: "Information",
            footer_about: "About Company",
            footer_blog: "Blog",
            footer_career: "Career",
            footer_partners: "Partners",
            footer_legal: "Legal Information",
            footer_terms: "Terms of Use",
            footer_privacy: "Privacy Policy",
            footer_cookies: "Cookies",
            footer_compliance: "Compliance",
            footer_app: "Download App",
            footer_app_desc: "Full functionality on your phone",
            app_store: "Download on the",
            play_store: "Get it on",
            footer_scan: "Scan to download",
            footer_payments: "We accept:",
            footer_rights: "All rights reserved.",
            footer_license: "License:",
            footer_vat: "VAT:",
            footer_owner: "Owner: Raed Mahmoud Kheiry Ahmed",
            badge_secure: "SSL Secured",
            badge_certified: "Certified",
            
            // Cart
            cart_title: "Shopping Cart",
            cart_empty_title: "Cart is Empty",
            cart_empty_text: "Add products from catalog",
            btn_browse: "Go to Catalog",
            cart_recommend: "Bought with this",
            cart_subtotal: "Subtotal",
            cart_delivery: "Delivery",
            cart_discount: "Discount",
            cart_total: "Total",
            cart_promo_placeholder: "Promo Code",
            btn_apply: "Apply",
            btn_continue: "Continue Shopping",
            btn_checkout: "Checkout",
            
            // Checkout
            checkout_title: "Checkout",
            step_info: "Information",
            step_delivery: "Delivery",
            step_payment: "Payment",
            step_confirm: "Confirmation",
            form_name: "Name",
            form_phone: "Phone",
            form_notes: "Order Notes",
            delivery_express: "Express Delivery",
            delivery_express_desc: "Delivery within 30 minutes",
            badge_popular: "Popular",
            delivery_standard: "Standard",
            delivery_standard_desc: "Delivery within 2 hours",
            delivery_pickup: "Pickup",
            delivery_pickup_desc: "Pick up at pharmacy",
            form_address: "Delivery Address",
            form_time: "Delivery Time",
            time_asap: "As soon as possible",
            time_specific: "Specific time",
            form_date: "Date",
            payment_cash: "Cash",
            payment_cash_desc: "Payment on delivery",
            payment_card: "Card Online",
            payment_card_desc: "Secure card payment",
            payment_vodafone: "Vodafone Cash",
            payment_vodafone_desc: "Payment via Vodafone",
            card_number: "Card Number",
            card_expiry: "Expiry Date",
            card_cvv: "CVV",
            card_name: "Name on Card",
            order_summary: "Order Summary",
            order_total: "Total to Pay:",
            confirm_terms: "I agree to the terms of service and privacy policy",
            confirm_marketing: "I want to receive news and special offers",
            btn_prev: "Back",
            btn_next: "Next",
            btn_place_order: "Place Order",
            
            // WhatsApp Order
            whatsapp_title: "Quick Order via WhatsApp",
            whatsapp_desc: "Your order will be sent to WhatsApp for quick processing. Our operator will contact you within 2 minutes.",
            btn_send_whatsapp: "Send to WhatsApp",
            btn_cancel: "Cancel",
            
            // General
            btn_save: "Save",
            btn_cancel: "Cancel",
            loading: "Loading...",
            error: "Error",
            success: "Success",
            warning: "Warning",
            info: "Info",
            
            // Languages
            language_changed: "Language changed",
            
            // Status
            status_online: "Online: 154 people",
            status_orders: "Delivering: 23 orders",
            status_ai: "AI Active",
            
            // Time
            time_just_now: "Just now",
            time_minutes_ago: "min ago",
            time_hours_ago: "h ago",
            
            // User
            user_default_name: "User"
        };
    }
}

// Инициализация системы i18n
let i18n = null;

document.addEventListener('DOMContentLoaded', function() {
    i18n = new I18n();
    
    // Глобальная функция для получения переводов
    window.getTranslation = (key, params) => i18n.get(key, params);
    
    // Глобальная функция для смены языка
    window.setLanguage = (lang) => i18n.setLanguage(lang);
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
} else {
    window.I18n = I18n;
}