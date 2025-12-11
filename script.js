// ===== CONFIGURATION =====
const CONFIG = {
    SITE_NAME: 'Radko-Pharm',
    OWNER: {
        name_ar: 'رائد محمود خيري أحمد',
        name_en: 'Raed Mahmoud Kheiry Ahmed',
        phone: '+20 127 592 9754',
        license: 'JT5179743',
        address_ar: 'عمارة حفرالباطن، شقة ٥٠٢، الحمام، محافظة مطروح',
        address_en: 'Hafar Al-Batin Building, Apartment 502, El-Hamam, Matrouh'
    },
    PHARMACY: {
        location: 'العشرين، مصر',
        coordinates: { lat: 30.1234, lng: 31.5678 },
        workingHours: '24/7'
    }
};

// ===== STATE MANAGEMENT =====
let currentLang = 'ar';
let currentTheme = 'light';
let cart = JSON.parse(localStorage.getItem('radko-pharm-cart')) || [];
let user = JSON.parse(localStorage.getItem('radko-pharm-user')) || null;
let aiChatHistory = JSON.parse(localStorage.getItem('radko-pharm-chat')) || [];

// ===== TRANSLATIONS =====
const TRANSLATIONS = {
    ar: {
        // Общие
        loading: "جاري التحميل...",
        searchPlaceholder: "ابحث عن دواء أو استشارة...",
        addToCart: "أضف إلى السلة",
        viewDetails: "عرض التفاصيل",
        cartEmpty: "سلة المشتريات فارغة",
        total: "المجموع",
        checkout: "إتمام الطلب",
        close: "إغلاق",
        save: "حفظ",
        cancel: "إلغاء",
        
        // Категории
        categories: {
            all: "الكل",
            antibiotics: "المضادات الحيوية",
            painkillers: "مسكنات الألم",
            vitamins: "الفيتامينات",
            chronic: "الأمراض المزمنة",
            children: "أطفال",
            skincare: "العناية بالبشرة"
        },
        
        // AI Доктор
        aiWelcome: "مرحباً! أنا د. DeepSeek، مساعدك الطبي الذكي",
        aiPlaceholder: "اكتب استفسارك الطبي هنا...",
        aiDisclaimer: "ملاحظة: هذه استشارة أولية ولا تغني عن زيارة الطبيب",
        aiTyping: "يكتب...",
        
        // Уведомления
        addedToCart: "تمت الإضافة إلى السلة",
        removedFromCart: "تم الحذف من السلة",
        orderPlaced: "تم تقديم الطلب بنجاح",
        reviewSubmitted: "شكراً لك على تقييمك!",
        subscribed: "تم الاشتراك في النشرة",
        
        // Формы
        name: "الاسم",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        message: "الرسالة",
        submit: "إرسال",
        required: "مطلوب",
        
        // Владелец
        owner: "مالك الصيدلية",
        license: "الترخيص",
        experience: "الخبرة",
        location: "الموقع"
    },
    
    en: {
        loading: "Loading...",
        searchPlaceholder: "Search for medicine or advice...",
        addToCart: "Add to Cart",
        viewDetails: "View Details",
        cartEmpty: "Shopping cart is empty",
        total: "Total",
        checkout: "Checkout",
        close: "Close",
        save: "Save",
        cancel: "Cancel",
        
        categories: {
            all: "All",
            antibiotics: "Antibiotics",
            painkillers: "Painkillers",
            vitamins: "Vitamins",
            chronic: "Chronic Diseases",
            children: "Children",
            skincare: "Skincare"
        },
        
        aiWelcome: "Hello! I'm Dr. DeepSeek, your smart medical assistant",
        aiPlaceholder: "Type your medical inquiry here...",
        aiDisclaimer: "Note: This is preliminary consultation and does not replace doctor visit",
        aiTyping: "Typing...",
        
        addedToCart: "Added to cart",
        removedFromCart: "Removed from cart",
        orderPlaced: "Order placed successfully",
        reviewSubmitted: "Thank you for your review!",
        subscribed: "Subscribed to newsletter",
        
        name: "Name",
        email: "Email",
        phone: "Phone",
        message: "Message",
        submit: "Submit",
        required: "Required",
        
        owner: "Pharmacy Owner",
        license: "License",
        experience: "Experience",
        location: "Location"
    },
    
    ru: {
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
        
        categories: {
            all: "Все",
            antibiotics: "Антибиотики",
            painkillers: "Обезболивающие",
            vitamins: "Витамины",
            chronic: "Хронические болезни",
            children: "Для детей",
            skincare: "Уход за кожей"
        },
        
        aiWelcome: "Привет! Я Dr. DeepSeek, ваш умный медицинский помощник",
        aiPlaceholder: "Введите ваш медицинский вопрос здесь...",
        aiDisclaimer: "Примечание: Это предварительная консультация и не заменяет визит к врачу",
        aiTyping: "Печатает...",
        
        addedToCart: "Добавлено в корзину",
        removedFromCart: "Удалено из корзины",
        orderPlaced: "Заказ оформлен успешно",
        reviewSubmitted: "Спасибо за ваш отзыв!",
        subscribed: "Подписан на рассылку",
        
        name: "Имя",
        email: "Email",
        phone: "Телефон",
        message: "Сообщение",
        submit: "Отправить",
        required: "Обязательно",
        
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
        name_ar: "أموكسيسيلين 500 مجم",
        name_en: "Amoxicillin 500 mg",
        name_ru: "Амоксициллин 500 мг",
        category: "antibiotics",
        description_ar: "مضاد حيوي واسع الطيف لعلاج الالتهابات البكتيرية مثل التهاب الحلق والتهاب الرئة",
        description_en: "Broad-spectrum antibiotic for treating bacterial infections like throat infection and pneumonia",
        description_ru: "Антибиотик широкого спектра для лечения бактериальных инфекций, таких как ангина и пневмония",
        price: 85,
        originalPrice: 95,
        discount: 10,
        image: "💊",
        stock: 150,
        dosage: "كبسولة واحدة كل 8 ساعات",
        sideEffects: "قد يسبب اضطرابات في المعدة",
        requiresPrescription: true,
        rating: 4.5,
        reviews: 124
    },
    {
        id: 2,
        name_ar: "باراسيتامول 500 مجم",
        name_en: "Paracetamol 500 mg",
        name_ru: "Парацетамол 500 мг",
        category: "painkillers",
        description_ar: "مسكن للألم وخافض للحرارة، مناسب للصداع وآلام الأسنان",
        description_en: "Pain reliever and fever reducer, suitable for headaches and toothaches",
        description_ru: "Обезболивающее и жаропонижающее, подходит от головной боли и зубной боли",
        price: 25,
        originalPrice: 30,
        discount: 16,
        image: "💊",
        stock: 500,
        dosage: "قرص واحد كل 6 ساعات",
        sideEffects: "نادراً ما يسبب آثاراً جانبية",
        requiresPrescription: false,
        rating: 4.8,
        reviews: 356
    },
    {
        id: 3,
        name_ar: "فيتامين سي 1000 مجم",
        name_en: "Vitamin C 1000 mg",
        name_ru: "Витамин C 1000 мг",
        category: "vitamins",
        description_ar: "مكمل غذائي لتعزيز المناعة ومضاد للأكسدة",
        description_en: "Dietary supplement to boost immunity and antioxidant",
        description_ru: "Пищевая добавка для укрепления иммунитета и антиоксидант",
        price: 45,
        image: "💊",
        stock: 200,
        dosage: "قرص واحد يومياً",
        sideEffects: "قد يسبب اضطرابات بسيطة في المعدة",
        requiresPrescription: false,
        rating: 4.7,
        reviews: 189
    },
    {
        id: 4,
        name_ar: "ميتفورمين 850 مجم",
        name_en: "Metformin 850 mg",
        name_ru: "Метформин 850 мг",
        category: "chronic",
        description_ar: "لعلاج مرض السكري من النوع الثاني، ينظم مستوى السكر في الدم",
        description_en: "For treatment of type 2 diabetes, regulates blood sugar levels",
        description_ru: "Для лечения диабета 2 типа, регулирует уровень сахара в крови",
        price: 65,
        image: "💊",
        stock: 120,
        dosage: "قرص واحد يومياً بعد الطعام",
        sideEffects: "قد يسبب اضطرابات في الجهاز الهضمي",
        requiresPrescription: true,
        rating: 4.6,
        reviews: 98
    },
    {
        id: 5,
        name_ar: "أيبوبروفين 400 مجم",
        name_en: "Ibuprofen 400 mg",
        name_ru: "Ибупрофен 400 мг",
        category: "painkillers",
        description_ar: "مضاد للالتهابات ومسكن للألم، مناسب لآلام العضلات والمفاصل",
        description_en: "Anti-inflammatory and pain reliever, suitable for muscle and joint pain",
        description_ru: "Противовоспалительное и обезболивающее, подходит от мышечной и суставной боли",
        price: 35,
        image: "💊",
        stock: 300,
        dosage: "قرص واحد كل 8 ساعات",
        sideEffects: "قد يسبب اضطرابات في المعدة",
        requiresPrescription: false,
        rating: 4.4,
        reviews: 267
    },
    {
        id: 6,
        name_ar: "أوميبرازول 20 مجم",
        name_en: "Omeprazole 20 mg",
        name_ru: "Омепразол 20 мг",
        category: "chronic",
        description_ar: "لعلاج حرقة المعدة وقرحة المعدة والارتجاع المريئي",
        description_en: "For treatment of heartburn, stomach ulcers and acid reflux",
        description_ru: "Для лечения изжоги, язвы желудка и кислотного рефлюкса",
        price: 75,
        originalPrice: 85,
        discount: 12,
        image: "💊",
        stock: 180,
        dosage: "كبسولة واحدة قبل الطعام",
        sideEffects: "نادراً ما يسبب صداعاً",
        requiresPrescription: true,
        rating: 4.5,
        reviews: 156
    },
    {
        id: 7,
        name_ar: "فيتامين د3 5000 وحدة",
        name_en: "Vitamin D3 5000 IU",
        name_ru: "Витамин D3 5000 МЕ",
        category: "vitamins",
        description_ar: "مكمل فيتامين د للعظام والصحة العامة وتعزيز المناعة",
        description_en: "Vitamin D supplement for bones, overall health and immunity",
        description_ru: "Добавка витамина D для костей, общего здоровья и иммунитета",
        price: 55,
        image: "💊",
        stock: 220,
        dosage: "كبسولة واحدة أسبوعياً",
        sideEffects: "آمن عند الجرعات الموصى بها",
        requiresPrescription: false,
        rating: 4.9,
        reviews: 312
    },
    {
        id: 8,
        name_ar: "أزيثروميسين 500 مجم",
        name_en: "Azithromycin 500 mg",
        name_ru: "Азитромицин 500 мг",
        category: "antibiotics",
        description_ar: "مضاد حيوي لعلاج التهابات الجهاز التنفسي والتهابات الجلد",
        description_en: "Antibiotic for treating respiratory infections and skin infections",
        description_ru: "Антибиотик для лечения респираторных инфекций и кожных инфекций",
        price: 95,
        image: "💊",
        stock: 90,
        dosage: "قرص واحد يومياً لمدة 3 أيام",
        sideEffects: "قد يسبب اضطرابات في المعدة",
        requiresPrescription: true,
        rating: 4.4,
        reviews: 87
    },
    {
        id: 9,
        name_ar: "كريم هيدروكورتيزون 1%",
        name_en: "Hydrocortisone Cream 1%",
        name_ru: "Крем гидрокортизон 1%",
        category: "skincare",
        description_ar: "كريم لعلاج الالتهابات الجلدية والحكة والطفح الجلدي",
        description_en: "Cream for treating skin inflammation, itching and rash",
        description_ru: "Крем для лечения воспалений кожи, зуда и сыпи",
        price: 40,
        image: "🧴",
        stock: 150,
        dosage: "يستخدم موضعياً مرتين يومياً",
        sideEffects: "نادراً ما يسبب تهيجاً",
        requiresPrescription: false,
        rating: 4.6,
        reviews: 134
    },
    {
        id: 10,
        name_ar: "شراب باراسيتامول للأطفال",
        name_en: "Children's Paracetamol Syrup",
        name_ru: "Детский сироп парацетамола",
        category: "children",
        description_ar: "شراب مسكن وخافض للحرارة خاص بالأطفال من عمر 3 أشهر",
        description_en: "Pain reliever and fever reducer syrup specially for children from 3 months",
        description_ru: "Сироп-обезболивающее и жаропонижающее для детей от 3 месяцев",
        price: 30,
        image: "🧪",
        stock: 250,
        dosage: "حسب الوزن والعمر",
        sideEffects: "آمن للأطفال",
        requiresPrescription: false,
        rating: 4.8,
        reviews: 289
    }
];

// ===== REVIEWS DATABASE =====
const REVIEWS = [
    {
        id: 1,
        name_ar: "أحمد محمد",
        name_en: "Ahmed Mohamed",
        name_ru: "Ахмед Мохамед",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
        rating: 5,
        text_ar: "أفضل صيدلية في العشرين! المستشار الذكي ساعدني في معرفة الجرعة المناسبة لأدوية والدتي. الخدمة سريعة والمتابعة ممتازة.",
        text_en: "Best pharmacy in El-Ashryn! The AI consultant helped me know the right dosage for my mother's medication. Fast service and excellent follow-up.",
        text_ru: "Лучшая аптека в Эль-Ашрин! AI-консультант помог определить правильную дозировку для лекарств моей матери. Быстрое обслуживание и отличное сопровождение.",
        date: "2024-02-20",
        verified: true
    },
    {
        id: 2,
        name_ar: "سارة خالد",
        name_en: "Sarah Khalid",
        name_ru: "Сара Халид",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        rating: 4.5,
        text_ar: "المستشار الذكي مفيد جداً! توفر جميع الأدوية وجميع العاملين محترفون. التوصيل خلال 30 دقيقة كما وعدوا.",
        text_en: "The AI consultant is very helpful! All medicines are available and all staff are professional. Delivery within 30 minutes as promised.",
        text_ru: "AI-консультант очень полезен! Все лекарства в наличии, весь персонал профессиональный. Доставка в течение 30 минут, как и обещали.",
        date: "2024-01-15",
        verified: true
    },
    {
        id: 3,
        name_ar: "محمد علي",
        name_en: "Mohamed Ali",
        name_ru: "Мухаммед Али",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed",
        rating: 5,
        text_ar: "خدمة 24/7 منقذة للحياة. طلبت دواءً في منتصف الليل وكان معي خلال 25 دقيقة. شكراً رادكو فارم!",
        text_en: "24/7 service is life-saving. I ordered medicine at midnight and it was with me within 25 minutes. Thank you Radko-Pharm!",
        text_ru: "Круглосуточное обслуживание спасает жизни. Заказал лекарство в полночь, и оно было у меня через 25 минут. Спасибо Radko-Pharm!",
        date: "2024-03-05",
        verified: true
    },
    {
        id: 4,
        name_ar: "فاطمة حسن",
        name_en: "Fatima Hassan",
        name_ru: "Фатима Хасан",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
        rating: 4,
        text_ar: "جودة الأدوية ممتازة والأسعار مناسبة. المستشار الذكي أجاب على جميع استفساراتي بخصوص تفاعل الأدوية.",
        text_en: "Excellent medicine quality and reasonable prices. The AI consultant answered all my questions about drug interactions.",
        text_ru: "Отличное качество лекарств и разумные цены. AI-консультант ответил на все мои вопросы о взаимодействии лекарств.",
        date: "2024-02-28",
        verified: true
    },
    {
        id: 5,
        name_ar: "خالد محمود",
        name_en: "Khalid Mahmoud",
        name_ru: "Халид Махмуд",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Khalid",
        rating: 5,
        text_ar: "الصيدلي رائد محترف جداً ويعطي نصائح قيمة. الموقع الإلكتروني سهل الاستخدام والتطبيق عملي.",
        text_en: "Pharmacist Raed is very professional and gives valuable advice. The website is user-friendly and the app is practical.",
        text_ru: "Фармацевт Раед очень профессионален и дает ценные советы. Веб-сайт удобен, приложение практично.",
        date: "2024-03-10",
        verified: true
    }
];

// ===== AI RESPONSES =====
const AI_RESPONSES = {
    ar: {
        greetings: [
            "مرحباً! أنا د. DeepSeek، مساعدك الطبي الذكي. كيف يمكنني مساعدتك اليوم؟",
            "أهلاً وسهلاً! أنا هنا للإجابة على استفساراتك الطبية. ما الذي يشغلك؟",
            "تحية طيبة! أنا مساعدك الرقمي في Radko-Pharm. هل لديك استفسار طبي؟"
        ],
        symptoms: {
            fever: "الحرارة قد تكون علامة على عدوى. اشرب السوائل، خذ باراسيتامول، وإذا استمرت أكثر من 3 أيام راجع الطبيب.",
            headache: "الصداع قد يكون بسبب التوتر أو الجفاف. جرب الراحة وشرب الماء. إذا كان شديداً أو مصحوباً بأعراض أخرى فاستشر الطبيب.",
            cough: "السعال الجاف يحتاج سوائل دافئة، والرطب قد يحتاج مقشع. إذا استمر أكثر من أسبوع أو مع حرارة فاستشر الطبيب."
        },
        medications: {
            dosage: "الجرعة تعتمد على العمر والوزن والحالة الصحية. راجع النشرة الداخلية أو استشر الصيدلي للجرعة الدقيقة.",
            interaction: "بعض الأدوية تتفاعل مع أخرى. أخبر طبيبك عن جميع الأدوية التي تتناولها قبل البدء بأي دواء جديد.",
            side_effects: "الآثار الجانبية تختلف حسب الدواء. اقرأ النشرة الطبية وراقب أي أعراض جديدة تظهر بعد تناول الدواء."
        },
        emergencies: [
            "للطوارئ الطبية، اتصل فوراً على 123 أو 115. لا تنتظر!",
            "في حالة الطوارئ، اذهب لأقرب مستشفى أو اتصل بالإسعاف على 123.",
            "للحالات الطارئة، تواصل مع الطوارئ على 115 أو اذهب للمستشفى فوراً."
        ]
    },
    en: {
        greetings: [
            "Hello! I'm Dr. DeepSeek, your smart medical assistant. How can I help you today?",
            "Welcome! I'm here to answer your medical questions. What's on your mind?",
            "Greetings! I'm your digital assistant at Radko-Pharm. Do you have a medical inquiry?"
        ],
        symptoms: {
            fever: "Fever could be a sign of infection. Drink fluids, take paracetamol, and if it lasts more than 3 days, see a doctor.",
            headache: "Headache could be due to stress or dehydration. Try resting and drinking water. If severe or with other symptoms, consult a doctor.",
            cough: "Dry cough needs warm fluids, wet cough may need an expectorant. If it lasts more than a week or with fever, see a doctor."
        },
        medications: {
            dosage: "Dosage depends on age, weight, and health condition. Check the leaflet or consult a pharmacist for exact dosage.",
            interaction: "Some medications interact with others. Tell your doctor about all medications you're taking before starting any new medicine.",
            side_effects: "Side effects vary by medication. Read the medical leaflet and monitor any new symptoms after taking the medicine."
        },
        emergencies: [
            "For medical emergencies, call 123 or 115 immediately. Don't wait!",
            "In case of emergency, go to the nearest hospital or call ambulance at 123.",
            "For emergency cases, contact emergency services at 115 or go to hospital immediately."
        ]
    },
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
            side_effects: "Побочные эффекты различаются в зависимости от лекарства. Прочтите медицинскую аннотацию и следите за любыми новыми симптомами после приема лекарства."
        },
        emergencies: [
            "При медицинских чрезвычайных ситуациях немедленно звоните по номеру 123 или 115. Не ждите!",
            "В экстренном случае отправляйтесь в ближайшую больницу или вызовите скорую помощь по номеру 123.",
            "В экстренных случаях свяжитесь со службой экстренной помощи по номеру 115 или немедленно обратитесь в больницу."
        ]
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    initApp();
    
    // Загрузка прелоадера
    setTimeout(() => {
        hidePreloader();
        initAnimations();
    }, 2000);
});

// ===== CORE FUNCTIONS =====
function initApp() {
    // Установка языка
    setLanguage('ar');
    
    // Установка темы
    if (localStorage.getItem('radko-pharm-theme')) {
        setTheme(localStorage.getItem('radko-pharm-theme'));
    }
    
    // Загрузка данных
    loadProducts();
    loadReviews();
    initCart();
    initAI();
    initMap();
    initSwiper();
    
    // Инициализация событий
    initEvents();
    
    // Статистика посещений
    trackVisit();
}

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('radko-pharm-lang', lang);
    
    if (lang === 'ar') {
        document.body.classList.add('rtl');
        document.body.classList.remove('ltr');
        document.documentElement.dir = 'rtl';
    } else {
        document.body.classList.add('ltr');
        document.body.classList.remove('rtl');
        document.documentElement.dir = 'ltr';
    }
    
    // Обновление интерфейса
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
    // Обновление текстов
    updateTexts();
    
    // Обновление продуктов
    loadProducts();
    
    // Обновление отзывов
    loadReviews();
    
    // Обновление AI
    initAI();
}

function updateTexts() {
    const t = TRANSLATIONS[currentLang];
    
    // Обновление кнопок
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (t[key]) element.textContent = t[key];
    });
    
    // Обновление плейсхолдеров
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
        setTimeout(() => preloader.remove(), 500);
    }
}

function showPreloader() {
    const preloader = document.querySelector('.preloader-3d') || createPreloader();
    preloader.style.opacity = '1';
    preloader.style.visibility = 'visible';
}

function createPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader-3d';
    preloader.innerHTML = `
        <div class="molecule-loader">
            <div class="atom"></div>
            <div class="atom"></div>
            <div class="atom"></div>
            <div class="atom"></div>
            <div class="atom"></div>
            <div class="atom"></div>
        </div>
        <div class="loading-text">
            <h2>Radko-Pharm</h2>
            <p>${TRANSLATIONS[currentLang].loading}</p>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    document.body.appendChild(preloader);
    return preloader;
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Анимация чисел
    animateNumbers();
    
    // Анимация при скролле
    initScrollAnimations();
    
    // Параллакс эффект
    initParallax();
    
    // Частицы
    initParticles();
}

function animateNumbers() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// ===== PRODUCTS =====
function loadProducts(category = 'all', search = '') {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    let filteredProducts = PRODUCTS;
    
    // Фильтрация по категории
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    // Поиск
    if (search) {
        filteredProducts = filteredProducts.filter(p => 
            p[`name_${currentLang}`].toLowerCase().includes(search.toLowerCase()) ||
            p[`description_${currentLang}`].toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Сортировка
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        const sortValue = sortSelect.value;
        switch(sortValue) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'discount':
                filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                break;
            default: // popular
                filteredProducts.sort((a, b) => b.rating - a.rating);
        }
    }
    
    // Отображение
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
    
    // Анимация появления
    animateProductCards();
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card-3d';
    card.dataset.id = product.id;
    
    const discountBadge = product.discount ? 
        `<div class="product-badge">-${product.discount}%</div>` : '';
    
    const originalPrice = product.originalPrice ? 
        `<span class="original-price">${product.originalPrice} ج.م</span>` : '';
    
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
            <h3 class="product-name-3d">${product[`name_${currentLang}`]}</h3>
            <p class="product-desc-3d">${product[`description_${currentLang}`]}</p>
            ${rating}
            <div class="product-meta">
                <div class="product-price">
                    ${originalPrice}
                    <span class="current-price">${product.price} ج.م</span>
                </div>
                <div class="product-stock">
                    <div class="stock-dot ${product.stock > 50 ? 'in-stock' : 'low-stock'}"></div>
                    <span>${product.stock > 50 ? 'متوفر' : 'كمية محدودة'}</span>
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
            showNotification('الكمية المطلوبة غير متوفرة', 'warning');
            return;
        }
        existingItem.quantity += quantity;
    } else {
        if (quantity > product.stock) {
            showNotification('الكمية المطلوبة غير متوفرة', 'warning');
            return;
        }
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${product[`name_${currentLang}`]} ${TRANSLATIONS[currentLang].addedToCart}`, 'success');
    
    // Анимация добавления в корзину
    animateCartAdd(productId);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification(TRANSLATIONS[currentLang].removedFromCart, 'info');
}

function updateCart() {
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('radko-pharm-cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Обновление счетчика
    const cartCount = document.querySelector('.cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Обновление модального окна корзины
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
                    <h4 class="cart-item-name">${item[`name_${currentLang}`]}</h4>
                    <div class="cart-item-price">${item.price} ج.م × ${item.quantity}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
                <div class="cart-item-total">${itemTotal} ج.م</div>
            </div>
        `;
    });
    
    cartBody.innerHTML = html;
    
    // Обновление итогов
    const cartTotal = document.querySelector('.cart-total');
    const finalTotal = document.querySelector('.final-total');
    if (cartTotal) cartTotal.textContent = `${total} ج.م`;
    if (finalTotal) finalTotal.textContent = `${total} ج.م`;
}

// ===== AI CHAT =====
function initAI() {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;
    
    // Загрузка истории чата
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
    
    // Добавление сообщения пользователя
    addUserMessage(message);
    input.value = '';
    
    // Сохранение в историю
    aiChatHistory.push({
        type: 'user',
        text: message,
        timestamp: new Date().toISOString()
    });
    
    // Имитация набора текста
    const typingIndicator = addTypingIndicator();
    
    // Имитация ответа AI
    setTimeout(() => {
        typingIndicator.remove();
        const response = generateAIResponse(message);
        addAIMessage(response);
        
        // Сохранение ответа в историю
        aiChatHistory.push({
            type: 'ai',
            text: response,
            timestamp: new Date().toISOString()
        });
        
        // Сохранение истории
        localStorage.setItem('radko-pharm-chat', JSON.stringify(aiChatHistory));
    }, 1500);
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    const responses = AI_RESPONSES[currentLang];
    
    // Проверка симптомов
    if (lowerMessage.includes('حرارة') || lowerMessage.includes('fever') || lowerMessage.includes('температура')) {
        return responses.symptoms.fever;
    }
    
    if (lowerMessage.includes('صداع') || lowerMessage.includes('headache') || lowerMessage.includes('головная')) {
        return responses.symptoms.headache;
    }
    
    if (lowerMessage.includes('سعال') || lowerMessage.includes('cough') || lowerMessage.includes('кашель')) {
        return responses.symptoms.cough;
    }
    
    // Проверка лекарств
    if (lowerMessage.includes('جرعة') || lowerMessage.includes('dosage') || lowerMessage.includes('дозировка')) {
        return responses.medications.dosage;
    }
    
    if (lowerMessage.includes('تفاعل') || lowerMessage.includes('interaction') || lowerMessage.includes('взаимодействие')) {
        return responses.medications.interaction;
    }
    
    if (lowerMessage.includes('أثر جانبي') || lowerMessage.includes('side effect') || lowerMessage.includes('побочный')) {
        return responses.medications.side_effects;
    }
    
    // Проверка экстренных случаев
    if (lowerMessage.includes('طوارئ') || lowerMessage.includes('emergency') || lowerMessage.includes('экстрен')) {
        return responses.emergencies[Math.floor(Math.random() * responses.emergencies.length)];
    }
    
    // Общий ответ
    const generalResponses = [
        "هذا سؤال مهم. أنصحك باستشارة الصيدلي أو الطبيب للحصول على تشخيص دقيق.",
        "يمكنني مساعدتك بمعلومات عامة، لكن للاستشارة الطبية الشخصية يفضل مراجعة الطبيب.",
        "هل يمكنك تقديم المزيد من التفاصيل حتى أتمكن من مساعدتك بشكل أفضل؟"
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
        '<span class="verified-review"><i class="fas fa-check-circle"></i> مشتري موثق</span>' : '';
    
    slide.innerHTML = `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-avatar">
                    <img src="${review.avatar}" alt="${review[`name_${currentLang}`]}">
                </div>
                <div class="reviewer-info">
                    <h4>${review[`name_${currentLang}`]}</h4>
                    ${verifiedBadge}
                    <div class="review-stars">
                        ${'★'.repeat(Math.floor(review.rating))}${review.rating % 1 ? '½' : ''}
                        <span>${review.rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>
            <div class="review-body">
                <p class="review-text">${review[`text_${currentLang}`]}</p>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
        </div>
    `;
    
    return slide;
}

// ===== MAP =====
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Создание карты
    const map = L.map('map').setView([30.1234, 31.5678], 15);
    
    // Добавление слоя карты
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Добавление маркера
    const marker = L.marker([30.1234, 31.5678]).addTo(map)
        .bindPopup('<b>Radko-Pharm</b><br>الصيدلية الذكية في العشرين')
        .openPopup();
    
    // Сохранение карты в глобальной области видимости
    window.radkoPharmMap = map;
}

// ===== SWIPER =====
function initSwiper() {
    const reviewsSwiper = new Swiper('#reviews-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });
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
    
    // Анимация появления
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Закрытие по клику
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
    return date.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : currentLang === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function trackVisit() {
    let visits = parseInt(localStorage.getItem('radko-pharm-visits')) || 0;
    visits++;
    localStorage.setItem('radko-pharm-visits', visits);
    
    // Можно отправить аналитику на сервер
    console.log(`Visits: ${visits}`);
}

function animateCartAdd(productId) {
    const productCard = document.querySelector(`.product-card-3d[data-id="${productId}"]`);
    const cartBtn = document.querySelector('.cart-quick');
    
    if (!productCard || !cartBtn) return;
    
    const productRect = productCard.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();
    
    // Создание летающего элемента
    const flyingItem = document.createElement('div');
    flyingItem.className = 'flying-item';
    flyingItem.innerHTML = '💊';
    flyingItem.style.cssText = `
        position: fixed;
        left: ${productRect.left + productRect.width / 2}px;
        top: ${productRect.top + productRect.height / 2}px;
        font-size: 24px;
        z-index: 10000;
        pointer-events: none;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    document.body.appendChild(flyingItem);
    
    // Анимация полета
    setTimeout(() => {
        flyingItem.style.left = `${cartRect.left + cartRect.width / 2}px`;
        flyingItem.style.top = `${cartRect.top + cartRect.height / 2}px`;
        flyingItem.style.transform = 'scale(0.5)';
        flyingItem.style.opacity = '0.5';
    }, 10);
    
    // Удаление элемента
    setTimeout(() => {
        flyingItem.remove();
        
        // Анимация корзины
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = '', 300);
    }, 600);
}

// ===== EVENT HANDLERS =====
function initEvents() {
    // Переключение языка
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
    
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
    
    // Сортировка
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const activeTag = document.querySelector('.tag.active');
            loadProducts(activeTag ? activeTag.dataset.category : 'all');
        });
    }
    
    // Загрузка еще продуктов
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Здесь можно добавить загрузку дополнительных продуктов
            showNotification('جاري تحميل المزيد من المنتجات...', 'info');
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
    
    // Быстрые действия AI
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            let message = '';
            
            switch(action) {
                case 'symptoms':
                    message = TRANSLATIONS[currentLang].symptoms || 'لدي أعراض وأحتاج استشارة';
                    break;
                case 'drugs':
                    message = TRANSLATIONS[currentLang].medications || 'أريد معلومات عن دواء';
                    break;
                case 'emergency':
                    message = TRANSLATIONS[currentLang].emergency || 'حالة طارئة';
                    break;
                case 'appointment':
                    message = TRANSLATIONS[currentLang].appointment || 'أريد حجز موعد';
                    break;
            }
            
            if (chatInput) {
                chatInput.value = message;
                sendAIMessage();
            }
        });
    });
    
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
    
    // Закрытие модалок по клику на фон
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-modal')) {
            e.target.classList.remove('active');
        }
        if (e.target.classList.contains('product-modal')) {
            e.target.classList.remove('active');
        }
        if (e.target.classList.contains('video-modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Делегирование событий для динамических элементов
    document.addEventListener('click', (e) => {
        // Добавление в корзину
        if (e.target.closest('.add-cart-btn')) {
            const productId = parseInt(e.target.closest('.add-cart-btn').dataset.id);
            addToCart(productId);
        }
        
        // Просмотр деталей продукта
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
                updateCart();
            }
        }
        
        if (e.target.closest('.decrease')) {
            const productId = parseInt(e.target.closest('.decrease').dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCart();
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
    
    // Прокрутка к разделу
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Закрытие мобильного меню
                const menu = document.querySelector('.main-menu');
                if (menu) menu.classList.remove('active');
            }
        });
    });
    
    // Кнопка "Наверх"
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Показать/скрыть кнопку при прокрутке
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
            showNotification('شكراً لك! سنتواصل معك قريباً.', 'success');
            contactForm.reset();
        });
    }
    
    // Форма подписки
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            if (validateEmail(email)) {
                showNotification(TRANSLATIONS[currentLang].subscribed, 'success');
                newsletterForm.reset();
            } else {
                showNotification('يرجى إدخال بريد إلكتروني صحيح', 'warning');
            }
        });
    }
    
    // Форма отзыва
    const reviewSubmitBtn = document.querySelector('.btn-submit');
    if (reviewSubmitBtn) {
        reviewSubmitBtn.addEventListener('click', submitReview);
    }
    
    // Звезды рейтинга
    document.querySelectorAll('.stars-input i').forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            setRatingStars(rating);
        });
    });
    
    // Видео-демо
    const watchDemoBtn = document.getElementById('watch-demo');
    const videoModal = document.querySelector('.video-modal');
    const closeVideo = document.querySelector('.close-video');
    
    if (watchDemoBtn && videoModal) {
        watchDemoBtn.addEventListener('click', () => {
            const videoFrame = document.getElementById('demo-video');
            if (videoFrame) {
                videoFrame.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'; // Пример видео
                videoModal.classList.add('active');
            }
        });
    }
    
    if (closeVideo && videoModal) {
        closeVideo.addEventListener('click', () => {
            const videoFrame = document.getElementById('demo-video');
            if (videoFrame) videoFrame.src = '';
            videoModal.classList.remove('active');
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
                    <h2>${product[`name_${currentLang}`]}</h2>
                    <div class="product-rating-large">
                        <div class="stars">${'★'.repeat(5)}</div>
                        <span>${product.rating} (${product.reviews} ${t.reviews || 'تقييم'})</span>
                    </div>
                </div>
            </div>
            
            <div class="product-detail-body">
                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> ${t.description || 'الوصف'}</h3>
                    <p>${product[`description_${currentLang}`]}</p>
                </div>
                
                <div class="detail-grid">
                    <div class="detail-item">
                        <i class="fas fa-prescription-bottle-alt"></i>
                        <div>
                            <h4>${t.dosage || 'الجرعة'}</h4>
                            <p>${product.dosage}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <h4>${t.sideEffects || 'الآثار الجانبية'}</h4>
                            <p>${product.sideEffects}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-pills"></i>
                        <div>
                            <h4>${t.requiresPrescription || 'يتطلب وصفة'}</h4>
                            <p>${product.requiresPrescription ? 'نعم' : 'لا'}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-box"></i>
                        <div>
                            <h4>${t.stock || 'المخزون'}</h4>
                            <p>${product.stock} ${t.units || 'وحدة'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="product-detail-price">
                    ${product.originalPrice ? `
                        <span class="original-price">${product.originalPrice} ج.م</span>
                        <span class="discount">-${product.discount}%</span>
                    ` : ''}
                    <h3 class="current-price">${product.price} ج.م</h3>
                </div>
                
                <div class="product-detail-actions">
                    <button class="add-cart-btn-large" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i>
                        ${t.addToCart}
                    </button>
                    <button class="buy-now-btn" data-id="${product.id}">
                        <i class="fas fa-bolt"></i>
                        ${t.buyNow || 'اشتري الآن'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Добавление обработчиков событий
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
        showNotification(t.cartEmpty, 'warning');
        return;
    }
    
    // Создание сообщения для WhatsApp
    let message = `طلب جديد من Radko-Pharm\n\n`;
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${index + 1}. ${item[`name_${currentLang}`]} × ${item.quantity} = ${itemTotal} ج.م\n`;
    });
    
    message += `\nالمجموع: ${total} ج.م\n`;
    message += `\nاسم العميل: __________\n`;
    message += `العنوان: __________\n`;
    message += `الهاتف: __________\n`;
    message += `طريقة الدفع: __________\n`;
    message += `ملاحظات: __________`;
    
    // Открытие WhatsApp
    const whatsappUrl = `https://wa.me/${CONFIG.OWNER.phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Очистка корзины
    cart = [];
    saveCart();
    updateCartUI();
    showNotification(TRANSLATIONS[currentLang].orderPlaced, 'success');
}

function openWhatsApp() {
    const message = `مرحباً، أريد الاستفسار عن خدمات Radko-Pharm`;
    const url = `https://wa.me/${CONFIG.OWNER.phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function setRatingStars(rating) {
    const stars = document.querySelectorAll('.stars-input i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
            star.classList.add('active');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
            star.classList.remove('active');
        }
    });
}

function submitReview() {
    const rating = document.querySelectorAll('.stars-input i.active').length;
    const nameInput = document.querySelector('.review-input');
    const textarea = document.querySelector('.review-textarea');
    
    if (rating === 0) {
        showNotification('يرجى اختيار التقييم', 'warning');
        return;
    }
    
    if (!nameInput || !nameInput.value.trim()) {
        showNotification('يرجى إدخال الاسم', 'warning');
        return;
    }
    
    if (!textarea || !textarea.value.trim()) {
        showNotification('يرجى كتابة التعليق', 'warning');
        return;
    }
    
    // Здесь можно отправить отзыв на сервер
    showNotification(TRANSLATIONS[currentLang].reviewSubmitted, 'success');
    
    // Сброс формы
    setRatingStars(0);
    if (nameInput) nameInput.value = '';
    if (textarea) textarea.value = '';
}

// ===== PARTICLE SYSTEM =====
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Установка размеров канваса
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Создание частиц
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `rgba(0, 200, 151, ${Math.random() * 0.5 + 0.1})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Инициализация частиц
    function init() {
        particles = [];
        const numberOfParticles = (canvas.width * canvas.height) / 10000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    // Соединение частиц
    function connectParticles() {
        const maxDistance = 100;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    ctx.strokeStyle = `rgba(0, 200, 151, ${0.2 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Анимация
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}

// ===== PARALLAX =====
function initParallax() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    window.addEventListener('scroll', () => {
        parallaxSections.forEach(section => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            section.style.transform = `translateY(${rate}px)`;
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-up, .slide-in-right, .slide-in-left');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// ===== SERVICE WORKER FOR PWA =====
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('Service Worker registered:', registration);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
}

// ===== MANIFEST FOR PWA =====
const manifest = {
    "name": "Radko-Pharm",
    "short_name": "RadkoPharm",
    "description": "الصيدلية الذكية في العشرين، مصر",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#1A1A2E",
    "theme_color": "#00C897",
    "icons": [
        {
            "src": "assets/icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "assets/icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
};

// Экспорт для использования в других файлах
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