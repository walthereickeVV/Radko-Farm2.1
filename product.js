// База данных товаров Radko-Pharm
const PRODUCTS_DB = {
    categories: {
        antibiotics: {
            id: "antibiotics",
            name: { ru: "Антибиотики", ar: "المضادات الحيوية", en: "Antibiotics" },
            icon: "fas fa-virus",
            color: "#FF6B6B"
        },
        painkillers: {
            id: "painkillers",
            name: { ru: "Обезболивающие", ar: "مسكنات الألم", en: "Painkillers" },
            icon: "fas fa-head-side-virus",
            color: "#667eea"
        },
        vitamins: {
            id: "vitamins",
            name: { ru: "Витамины", ar: "فيتامينات", en: "Vitamins" },
            icon: "fas fa-apple-alt",
            color: "#4CAF50"
        },
        chronic: {
            id: "chronic",
            name: { ru: "Хронические болезни", ar: "أمراض مزمنة", en: "Chronic Diseases" },
            icon: "fas fa-heartbeat",
            color: "#FFA726"
        },
        cosmetics: {
            id: "cosmetics",
            name: { ru: "Косметика", ar: "مستحضرات تجميل", en: "Cosmetics" },
            icon: "fas fa-spa",
            color: "#9C27B0"
        },
        supplements: {
            id: "supplements",
            name: { ru: "БАДы", ar: "مكملات غذائية", en: "Supplements" },
            icon: "fas fa-capsules",
            color: "#00C897"
        },
        first_aid: {
            id: "first_aid",
            name: { ru: "Первая помощь", ar: "الإسعافات الأولية", en: "First Aid" },
            icon: "fas fa-first-aid",
            color: "#F44336"
        },
        baby: {
            id: "baby",
            name: { ru: "Для детей", ar: "للأطفال", en: "For Children" },
            icon: "fas fa-baby",
            color: "#2196F3"
        }
    },
    
    products: [
        // Антибиотики
        {
            id: 1,
            name: {
                ru: "Амоксициллин 500 мг",
                ar: "أموكسيسيلين 500 ملغ",
                en: "Amoxicillin 500 mg"
            },
            category: "antibiotics",
            description: {
                ru: "Антибиотик широкого спектра действия для лечения бактериальных инфекций",
                ar: "مضاد حيوي واسع الطيف لعلاج الالتهابات البكتيرية",
                en: "Broad-spectrum antibiotic for treating bacterial infections"
            },
            manufacturer: {
                ru: "Pfizer",
                ar: "فايزر",
                en: "Pfizer"
            },
            price: 85,
            oldPrice: 95,
            image: "💊",
            stock: 150,
            requiresPrescription: true,
            rating: 4.8,
            reviews: 42,
            features: [
                { ru: "Широкий спектр действия", ar: "طيف واسع من العمل", en: "Broad spectrum" },
                { ru: "Высокая эффективность", ar: "فعالية عالية", en: "High efficacy" },
                { ru: "Минимум побочных эффектов", ar: "حد أدنى من الآثار الجانبية", en: "Minimal side effects" }
            ],
            dosage: {
                ru: "По 1 таблетке 3 раза в день",
                ar: "قرص واحد 3 مرات يوميا",
                en: "1 tablet 3 times daily"
            },
            activeSubstance: "Amoxicillin",
            quantity: "20 таблеток",
            expiration: "2025-12-31",
            barcode: "123456789012"
        },
        
        // Обезболивающие
        {
            id: 2,
            name: {
                ru: "Парацетамол 500 мг",
                ar: "باراسيتامول 500 ملغ",
                en: "Paracetamol 500 mg"
            },
            category: "painkillers",
            description: {
                ru: "Обезболивающее и жаропонижающее средство",
                ar: "مسكن للألم وخافض للحرارة",
                en: "Pain reliever and fever reducer"
            },
            manufacturer: {
                ru: "GSK",
                ar: "جي إس كي",
                en: "GSK"
            },
            price: 25,
            oldPrice: 30,
            image: "💊",
            stock: 500,
            requiresPrescription: false,
            rating: 4.5,
            reviews: 128,
            features: [
                { ru: "Быстрое действие", ar: "عمل سريع", en: "Fast acting" },
                { ru: "Безопасен для детей", ar: "آمن للأطفال", en: "Safe for children" },
                { ru: "Без рецепта", ar: "بدون وصفة طبية", en: "Over the counter" }
            ],
            dosage: {
                ru: "По 1-2 таблетки 3-4 раза в день",
                ar: "1-2 قرص 3-4 مرات يوميا",
                en: "1-2 tablets 3-4 times daily"
            },
            activeSubstance: "Paracetamol",
            quantity: "24 таблетки",
            expiration: "2025-06-30",
            barcode: "234567890123"
        },
        
        // Витамины
        {
            id: 3,
            name: {
                ru: "Витамин C 1000 мг",
                ar: "فيتامين سي 1000 ملغ",
                en: "Vitamin C 1000 mg"
            },
            category: "vitamins",
            description: {
                ru: "Витамин C для укрепления иммунитета и антиоксидантной защиты",
                ar: "فيتامين سي لتقوية المناعة والحماية المضادة للأكسدة",
                en: "Vitamin C for immune support and antioxidant protection"
            },
            manufacturer: {
                ru: "Solgar",
                ar: "سولجار",
                en: "Solgar"
            },
            price: 45,
            oldPrice: 55,
            image: "💊",
            stock: 200,
            requiresPrescription: false,
            rating: 4.9,
            reviews: 67,
            features: [
                { ru: "Укрепление иммунитета", ar: "تعزيز المناعة", en: "Immune support" },
                { ru: "Антиоксидант", ar: "مضاد للأكسدة", en: "Antioxidant" },
                { ru: "Высокая усвояемость", ar: "امتصاص عالي", en: "High absorption" }
            ],
            dosage: {
                ru: "1 таблетка в день",
                ar: "قرص واحد يوميا",
                en: "1 tablet daily"
            },
            activeSubstance: "Ascorbic Acid",
            quantity: "60 таблеток",
            expiration: "2026-03-15",
            barcode: "345678901234"
        },
        
        // Для хронических болезней
        {
            id: 4,
            name: {
                ru: "Метформин 850 мг",
                ar: "ميتفورمين 850 ملغ",
                en: "Metformin 850 mg"
            },
            category: "chronic",
            description: {
                ru: "Препарат для лечения сахарного диабета 2 типа",
                ar: "دواء لعلاج مرض السكري من النوع 2",
                en: "Medication for type 2 diabetes treatment"
            },
            manufacturer: {
                ru: "Merck",
                ar: "ميرك",
                en: "Merck"
            },
            price: 65,
            oldPrice: 75,
            image: "💊",
            stock: 120,
            requiresPrescription: true,
            rating: 4.7,
            reviews: 89,
            features: [
                { ru: "Контроль уровня сахара", ar: "التحكم في مستويات السكر", en: "Blood sugar control" },
                { ru: "Улучшение чувствительности к инсулину", ar: "تحسين حساسية الأنسولين", en: "Improves insulin sensitivity" },
                { ru: "Подходит для длительного приема", ar: "مناسب للاستخدام طويل الأمد", en: "Suitable for long-term use" }
            ],
            dosage: {
                ru: "По назначению врача",
                ar: "حسب وصفة الطبيب",
                en: "As prescribed by doctor"
            },
            activeSubstance: "Metformin Hydrochloride",
            quantity: "60 таблеток",
            expiration: "2025-09-30",
            barcode: "456789012345"
        },
        
        // Косметика
        {
            id: 5,
            name: {
                ru: "Увлажняющий крем La Roche-Posay",
                ar: "كريم مرطب لا روش بوزيه",
                en: "La Roche-Posay Hydrating Cream"
            },
            category: "cosmetics",
            description: {
                ru: "Интенсивно увлажняющий крем для чувствительной кожи",
                ar: "كريم مرطب مكثف للبشرة الحساسة",
                en: "Intensive hydrating cream for sensitive skin"
            },
            manufacturer: {
                ru: "La Roche-Posay",
                ar: "لا روش بوزيه",
                en: "La Roche-Posay"
            },
            price: 350,
            oldPrice: 420,
            image: "🧴",
            stock: 80,
            requiresPrescription: false,
            rating: 4.9,
            reviews: 156,
            features: [
                { ru: "Для чувствительной кожи", ar: "للبشرة الحساسة", en: "For sensitive skin" },
                { ru: "Гипоаллергенный", ar: "غير مسبب للحساسية", en: "Hypoallergenic" },
                { ru: "Содержит термальную воду", ar: "يحتوي على ماء حراري", en: "Contains thermal water" }
            ],
            dosage: {
                ru: "Наносить утром и вечером",
                ar: "يطبق صباحا ومساء",
                en: "Apply morning and evening"
            },
            activeSubstance: "Thermal Spring Water, Niacinamide",
            quantity: "40 мл",
            expiration: "2026-01-20",
            barcode: "567890123456"
        },
        
        // БАДы
        {
            id: 6,
            name: {
                ru: "Рыбий жир Омега-3",
                ar: "زيت السمك أوميغا 3",
                en: "Omega-3 Fish Oil"
            },
            category: "supplements",
            description: {
                ru: "Высококачественный рыбий жир с Омега-3 для здоровья сердца и мозга",
                ar: "زيت سمك عالي الجودة مع أوميغا 3 لصحة القلب والدماغ",
                en: "High-quality fish oil with Omega-3 for heart and brain health"
            },
            manufacturer: {
                ru: "Now Foods",
                ar: "ناو فودز",
                en: "Now Foods"
            },
            price: 120,
            oldPrice: 150,
            image: "🧴",
            stock: 95,
            requiresPrescription: false,
            rating: 4.8,
            reviews: 203,
            features: [
                { ru: "Поддержка сердца", ar: "دعم صحة القلب", en: "Heart health support" },
                { ru: "Улучшение работы мозга", ar: "تحسين وظائف الدماغ", en: "Brain function support" },
                { ru: "Высокая концентрация", ar: "تركيز عالي", en: "High concentration" }
            ],
            dosage: {
                ru: "2 капсулы в день",
                ar: "كبسولتين يوميا",
                en: "2 capsules daily"
            },
            activeSubstance: "EPA, DHA",
            quantity: "120 капсул",
            expiration: "2025-11-30",
            barcode: "678901234567"
        },
        
        // Первая помощь
        {
            id: 7,
            name: {
                ru: "Аптечка первой помощи",
                ar: "حقيبة الإسعافات الأولية",
                en: "First Aid Kit"
            },
            category: "first_aid",
            description: {
                ru: "Комплект для оказания первой медицинской помощи",
                ar: "مجموعة لتقديم الإسعافات الأولية",
                en: "Set for providing first medical aid"
            },
            manufacturer: {
                ru: "3M",
                ar: "ثري إم",
                en: "3M"
            },
            price: 280,
            oldPrice: 350,
            image: "🩹",
            stock: 45,
            requiresPrescription: false,
            rating: 4.6,
            reviews: 78,
            features: [
                { ru: "Полный комплект", ar: "مجموعة كاملة", en: "Complete set" },
                { ru: "Компактный размер", ar: "حجم مضغوط", en: "Compact size" },
                { ru: "Для дома и авто", ar: "للمنزل والسيارة", en: "For home and car" }
            ],
            dosage: {
                ru: "Использовать по необходимости",
                ar: "استخدم عند الحاجة",
                en: "Use as needed"
            },
            activeSubstance: "Various",
            quantity: "1 набор",
            expiration: "2027-12-31",
            barcode: "789012345678"
        },
        
        // Для детей
        {
            id: 8,
            name: {
                ru: "Детский сироп от кашля",
                ar: "شراب السعال للأطفال",
                en: "Children's Cough Syrup"
            },
            category: "baby",
            description: {
                ru: "Безопасный сироп от кашля для детей с приятным вкусом",
                ar: "شراب سعال آمن للأطفال بطعم لذيذ",
                en: "Safe cough syrup for children with pleasant taste"
            },
            manufacturer: {
                ru: "Johnson & Johnson",
                ar: "جونسون آند جونسون",
                en: "Johnson & Johnson"
            },
            price: 55,
            oldPrice: 65,
            image: "🧴",
            stock: 180,
            requiresPrescription: false,
            rating: 4.7,
            reviews: 142,
            features: [
                { ru: "Для детей от 2 лет", ar: "للأطفال من سن سنتين", en: "For children from 2 years" },
                { ru: "Приятный вкус", ar: "طعم لذيذ", en: "Pleasant taste" },
                { ru: "Без спирта", ar: "بدون كحول", en: "Alcohol-free" }
            ],
            dosage: {
                ru: "По 5 мл 3 раза в день",
                ar: "5 مل 3 مرات يوميا",
                en: "5 ml 3 times daily"
            },
            activeSubstance: "Dextromethorphan, Guaifenesin",
            quantity: "100 мл",
            expiration: "2025-08-15",
            barcode: "890123456789"
        },
        
        // Новинки
        {
            id: 9,
            name: {
                ru: "Ибупрофен 400 мг экспресс",
                ar: "ايبوبروفين 400 ملغ اكسبريس",
                en: "Ibuprofen 400 mg Express"
            },
            category: "painkillers",
            description: {
                ru: "Быстродействующее обезболивающее с противовоспалительным эффектом",
                ar: "مسكن ألم سريع المفعول مع تأثير مضاد للالتهابات",
                en: "Fast-acting pain reliever with anti-inflammatory effect"
            },
            manufacturer: {
                ru: "Bayer",
                ar: "باير",
                en: "Bayer"
            },
            price: 35,
            oldPrice: 45,
            image: "💊",
            stock: 300,
            requiresPrescription: false,
            rating: 4.8,
            reviews: 94,
            features: [
                { ru: "Быстрое действие", ar: "عمل سريع", en: "Fast acting" },
                { ru: "Противовоспалительный", ar: "مضاد للالتهابات", en: "Anti-inflammatory" },
                { ru: "Длительный эффект", ar: "تأثير طويل الأمد", en: "Long-lasting effect" }
            ],
            dosage: {
                ru: "1 таблетка при необходимости",
                ar: "قرص واحد عند الحاجة",
                en: "1 tablet as needed"
            },
            activeSubstance: "Ibuprofen",
            quantity: "20 таблеток",
            expiration: "2025-10-31",
            barcode: "901234567890"
        },
        
        {
            id: 10,
            name: {
                ru: "Витамин D3 5000 МЕ",
                ar: "فيتامين د 3 5000 وحدة دولية",
                en: "Vitamin D3 5000 IU"
            },
            category: "vitamins",
            description: {
                ru: "Высокодозированный витамин D3 для костей и иммунитета",
                ar: "فيتامين د 3 عالي الجرعة للعظام والمناعة",
                en: "High-dose vitamin D3 for bones and immunity"
            },
            manufacturer: {
                ru: "Nature's Bounty",
                ar: "ناتشرز باونتي",
                en: "Nature's Bounty"
            },
            price: 75,
            oldPrice: 90,
            image: "💊",
            stock: 110,
            requiresPrescription: false,
            rating: 4.9,
            reviews: 167,
            features: [
                { ru: "Высокая дозировка", ar: "جرعة عالية", en: "High dosage" },
                { ru: "Для здоровья костей", ar: "لصحة العظام", en: "For bone health" },
                { ru: "Укрепление иммунитета", ar: "تعزيز المناعة", en: "Immune support" }
            ],
            dosage: {
                ru: "1 капсула в день",
                ar: "كبسولة واحدة يوميا",
                en: "1 capsule daily"
            },
            activeSubstance: "Cholecalciferol",
            quantity: "60 капсул",
            expiration: "2026-05-20",
            barcode: "012345678901"
        }
    ],
    
    // Популярные товары
    popular: [1, 2, 3, 5, 6],
    
    // Рекомендуемые товары
    recommended: [4, 7, 8, 9, 10],
    
    // Методы для работы с товарами
    getProducts: function(filter = "all", sort = "popular", search = "") {
        let products = this.products;
        
        // Фильтрация по категории
        if (filter !== "all") {
            products = products.filter(p => p.category === filter);
        }
        
        // Поиск
        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(p => 
                p.name.ru.toLowerCase().includes(searchLower) ||
                p.name.ar.includes(search) ||
                p.name.en.toLowerCase().includes(searchLower) ||
                p.description.ru.toLowerCase().includes(searchLower) ||
                p.description.en.toLowerCase().includes(searchLower)
            );
        }
        
        // Сортировка
        switch(sort) {
            case "price-asc":
                products.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                products.sort((a, b) => b.price - a.price);
                break;
            case "new":
                // Новые товары - по id (предполагаем что больший id = новее)
                products.sort((a, b) => b.id - a.id);
                break;
            case "rating":
                products.sort((a, b) => b.rating - a.rating);
                break;
            case "popular":
            default:
                // По умолчанию сортируем по популярности (id в списке популярных)
                products.sort((a, b) => {
                    const aIndex = this.popular.indexOf(a.id);
                    const bIndex = this.popular.indexOf(b.id);
                    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                    if (aIndex !== -1) return -1;
                    if (bIndex !== -1) return 1;
                    return b.rating - a.rating;
                });
        }
        
        return products;
    },
    
    getProductById: function(id) {
        return this.products.find(p => p.id === id);
    },
    
    getCategory: function(categoryId) {
        return this.categories[categoryId];
    },
    
    getAllCategories: function() {
        return Object.values(this.categories);
    },
    
    getPopularProducts: function() {
        return this.popular.map(id => this.getProductById(id));
    },
    
    getRecommendedProducts: function() {
        return this.recommended.map(id => this.getProductById(id));
    },
    
    // Поиск лекарств по симптомам (упрощенный AI поиск)
    searchBySymptoms: function(symptoms) {
        const symptomMap = {
            'головная боль': ['painkillers'],
            'температура': ['painkillers'],
            'кашель': ['baby', 'painkillers'],
            'простуда': ['antibiotics', 'vitamins'],
            'боль в горле': ['painkillers'],
            'диабет': ['chronic'],
            'давление': ['chronic'],
            'иммунитет': ['vitamins', 'supplements'],
            'кожа': ['cosmetics'],
            'аллергия': ['chronic']
        };
        
        const matchedCategories = new Set();
        
        Object.keys(symptomMap).forEach(symptom => {
            if (symptoms.toLowerCase().includes(symptom)) {
                symptomMap[symptom].forEach(cat => matchedCategories.add(cat));
            }
        });
        
        if (matchedCategories.size === 0) {
            return this.getPopularProducts();
        }
        
        return this.products.filter(p => 
            Array.from(matchedCategories).includes(p.category)
        ).slice(0, 10);
    }
};

// Экспорт базы данных
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PRODUCTS_DB;
} else {
    window.PRODUCTS_DB = PRODUCTS_DB;
}