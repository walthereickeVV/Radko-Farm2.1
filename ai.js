// AI Консультант Dr. DeepSeek
class AIConsultant {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.voiceEnabled = false;
        this.speechRecognition = null;
        this.synthesis = null;
        
        this.init();
    }
    
    init() {
        this.loadChatHistory();
        this.initVoiceRecognition();
        this.initSpeechSynthesis();
        this.setupEventListeners();
    }
    
    // Загрузка истории чата
    loadChatHistory() {
        const saved = localStorage.getItem('radko_ai_chat');
        if (saved) {
            this.messages = JSON.parse(saved);
            this.renderMessages();
        } else {
            this.addWelcomeMessage();
        }
    }
    
    // Сохранение истории чата
    saveChatHistory() {
        localStorage.setItem('radko_ai_chat', JSON.stringify(this.messages.slice(-50))); // Храним последние 50 сообщений
    }
    
    // Добавление приветственного сообщения
    addWelcomeMessage() {
        const lang = this.getCurrentLanguage();
        const welcomeMessages = {
            ru: [
                "Здравствуйте! Я Dr. DeepSeek, ваш AI-консультант в аптеке Radko-Pharm.",
                "Могу помочь с вопросами о лекарствах, дозировках, побочных эффектах и совместимости препаратов.",
                "Пожалуйста, помните: я не заменяю консультацию врача. В сложных случаях обращайтесь к специалисту."
            ],
            ar: [
                "مرحبًا! أنا دكتور DeepSeek، مستشار الذكاء الاصطناعي الخاص بك في صيدلية Radko-Pharm.",
                "يمكنني المساعدة في الأسئلة حول الأدوية والجرعات والآثار الجانبية وتوافق الأدوية.",
                "يرجى ملاحظة: أنا لا أحل محل استشارة الطبيب. في الحالات المعقدة، راجع أخصائيًا."
            ],
            en: [
                "Hello! I'm Dr. DeepSeek, your AI consultant at Radko-Pharm pharmacy.",
                "I can help with questions about medications, dosages, side effects, and drug compatibility.",
                "Please note: I don't replace a doctor's consultation. In complex cases, consult a specialist."
            ]
        };
        
        this.addMessage({
            type: 'ai',
            content: welcomeMessages[lang].join(' '),
            timestamp: new Date().toISOString()
        });
    }
    
    // Добавление сообщения
    addMessage(message) {
        this.messages.push({
            ...message,
            id: Date.now() + Math.random()
        });
        
        this.saveChatHistory();
        this.renderMessages();
        
        // Прокрутка к последнему сообщению
        setTimeout(() => {
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, 100);
    }
    
    // Отрисовка сообщений
    renderMessages() {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const lang = this.getCurrentLanguage();
        
        container.innerHTML = this.messages.map(msg => `
            <div class="message ${msg.type}">
                <div class="avatar">
                    <i class="fas fa-${msg.type === 'ai' ? 'robot' : 'user'}"></i>
                </div>
                <div class="content">
                    <div class="name">${msg.type === 'ai' ? 'Dr. DeepSeek' : this.getUserName()}</div>
                    <div class="text">${this.formatMessage(msg.content)}</div>
                    <div class="time">${this.formatTime(msg.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }
    
    // Форматирование сообщения
    formatMessage(content) {
        // Заменяем переносы строк на <br>
        return content.replace(/\n/g, '<br>');
    }
    
    // Форматирование времени
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Меньше минуты
            return this.getText('time_just_now');
        } else if (diff < 3600000) { // Меньше часа
            const minutes = Math.floor(diff / 60000);
            return `${minutes} ${this.getText('time_minutes_ago')}`;
        } else if (diff < 86400000) { // Меньше суток
            const hours = Math.floor(diff / 3600000);
            return `${hours} ${this.getText('time_hours_ago')}`;
        } else {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }
    
    // Получение имени пользователя
    getUserName() {
        const user = JSON.parse(localStorage.getItem('radko_user')) || {};
        return user.name || this.getText('user_default_name');
    }
    
    // Обработка входящих сообщений
    async processMessage(text) {
        this.addMessage({
            type: 'user',
            content: text,
            timestamp: new Date().toISOString()
        });
        
        // Показываем индикатор набора
        this.showTypingIndicator();
        
        // Имитируем задержку ответа AI
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateResponse(text);
        }, 1000 + Math.random() * 2000); // Задержка 1-3 секунды
    }
    
    // Генерация ответа AI
    async generateResponse(userMessage) {
        const lang = this.getCurrentLanguage();
        const lowerMessage = userMessage.toLowerCase();
        
        let response = '';
        
        // Определяем тип запроса
        if (this.isDosageQuestion(lowerMessage)) {
            response = this.getDosageResponse(lang);
        } else if (this.isSideEffectsQuestion(lowerMessage)) {
            response = this.getSideEffectsResponse(lang);
        } else if (this.isInteractionQuestion(lowerMessage)) {
            response = this.getInteractionResponse(lang);
        } else if (this.isAlternativeQuestion(lowerMessage)) {
            response = await this.getAlternativeResponse(userMessage, lang);
        } else if (this.isSymptomQuestion(lowerMessage)) {
            response = await this.getSymptomResponse(userMessage, lang);
        } else if (this.isPrescriptionQuestion(lowerMessage)) {
            response = this.getPrescriptionResponse(lang);
        } else if (this.isEmergencyQuestion(lowerMessage)) {
            response = this.getEmergencyResponse(lang);
        } else {
            response = this.getGeneralResponse(lang);
        }
        
        // Добавляем медицинский отказ
        response += '\n\n' + this.getMedicalDisclaimer(lang);
        
        this.addMessage({
            type: 'ai',
            content: response,
            timestamp: new Date().toISOString()
        });
        
        // Озвучиваем ответ если включен голос
        if (this.voiceEnabled) {
            this.speak(response);
        }
    }
    
    // Определение типа вопроса
    isDosageQuestion(message) {
        const keywords = ['дозировка', 'доза', 'сколько принимать', 'график приема', 'كم الجرعة', 'جرعة', 'dosage', 'dose', 'how much to take'];
        return keywords.some(keyword => message.includes(keyword));
    }
    
    isSideEffectsQuestion(message) {
        const keywords = ['побочные', 'эффекты', 'побочка', 'осложнения', 'آثار جانبية', 'مضاعفات', 'side effects', 'complications'];
        return keywords.some(keyword => message.includes(keyword));
    }
    
    isInteractionQuestion(message) {
        const keywords = ['совместимость', 'взаимодействие', 'можно ли вместе', 'совместный прием', 'تفاعل', 'توافق', 'interaction', 'compatibility'];
        return keywords.some(keyword => message.includes(keyword));
    }
    
    isAlternativeQuestion(message) {
        const keywords = ['аналог', 'замена', 'дешевле', 'похожее', 'بديل', 'استبدال', 'alternative', 'substitute', 'cheaper'];
        return keywords.some(keyword => message.includes(keyword));
    }
    
    isSymptomQuestion(message) {
        const symptoms = [
            'головная боль', 'температура', 'кашель', 'насморк', 'боль в горле',
            'тошнота', 'рвота', 'диарея', 'запор', 'аллергия',
            'صداع', 'حرارة', 'سعال', 'سيلان الأنف', 'ألم الحلق',
            'غثيان', 'قيء', 'إسهال', 'إمساك', 'حساسية',
            'headache', 'fever', 'cough', 'runny nose', 'sore throat',
            'nausea', 'vomiting', 'diarrhea', 'constipation', 'allergy'
        ];
        return symptoms.some(symptom => message.includes(symptom));
    }
    
    isPrescriptionQuestion(message) {
        const keywords = ['рецепт', 'нужен ли рецепт', 'без рецепта', 'وصفة طبية', 'روشتة', 'prescription', 'without prescription'];
        return keywords.some(keyword => message.includes(keyword));
    }
    
    isEmergencyQuestion(message) {
        const keywords = ['срочно', 'экстренно', 'скорая', 'опасно', 'طارئ', 'عاجل', 'emergency', 'urgent', 'danger'];
        return keywords.some(keyword => message.includes(keyword));
    }
    
    // Генерация ответов
    getDosageResponse(lang) {
        const responses = {
            ru: `Дозировка лекарств зависит от многих факторов: возраста, веса, состояния здоровья и диагноза.\n\nДля точного определения дозировки:\n1️⃣ Ознакомьтесь с инструкцией к препарату\n2️⃣ Проконсультируйтесь с врачом или фармацевтом\n3️⃣ Учитывайте возрастные ограничения\n\nМогу помочь найти инструкцию к конкретному препарату. Укажите его название.`,
            ar: `تعتمد جرعة الأدوية على العديد من العوامل: العمر، الوزن، الحالة الصحية، والتشخيص.\n\nلتحديد الجرعة بدقة:\n1️⃣ اقرأ نشرة الدواء\n2️⃣ استشر الطبيب أو الصيدلي\n3️⃣ خذ في الاعتبار القيود العمرية\n\nيمكنني المساعدة في العثور على نشرة دواء معين. يرجى ذكر اسم الدواء.`,
            en: `Medication dosage depends on many factors: age, weight, health condition, and diagnosis.\n\nTo determine dosage accurately:\n1️⃣ Read the drug instructions\n2️⃣ Consult a doctor or pharmacist\n3️⃣ Consider age restrictions\n\nI can help find instructions for a specific medication. Please provide the drug name.`
        };
        return responses[lang];
    }
    
    getSideEffectsResponse(lang) {
        const responses = {
            ru: `Побочные эффекты могут варьироваться от легких до серьезных. Наиболее частые:\n\n• Тошнота, головокружение\n• Сонливость или бессонница\n• Аллергические реакции\n• Расстройства ЖКТ\n\nЧто делать:\n1️⃣ Прекратите прием при сильных реакциях\n2️⃣ Проконсультируйтесь с врачом\n3️⃣ Сообщите фармацевту о всех принимаемых лекарствах\n\nНазовите препарат для получения конкретной информации.`,
            ar: `يمكن أن تتراوح الآثار الجانبية من خفيفة إلى خطيرة. الأكثر شيوعًا:\n\n• الغثيان، الدوخة\n• النعاس أو الأرق\n• ردود الفعل التحسسية\n• اضطرابات الجهاز الهضمي\n\nما يجب فعله:\n1️⃣ توقف عن تناول الدواء في حالة ردود فعل قوية\n2️⃣ استشر الطبيب\n3️⃣ أخبر الصيدلي عن جميع الأدوية التي تتناولها\n\nيرجى ذكر اسم الدواء للحصول على معلومات محددة.`,
            en: `Side effects can range from mild to serious. Most common:\n\n• Nausea, dizziness\n• Drowsiness or insomnia\n• Allergic reactions\n• Gastrointestinal disorders\n\nWhat to do:\n1️⃣ Stop taking if severe reactions occur\n2️⃣ Consult a doctor\n3️⃣ Inform the pharmacist about all medications you're taking\n\nPlease provide the drug name for specific information.`
        };
        return responses[lang];
    }
    
    getInteractionResponse(lang) {
        const responses = {
            ru: `Взаимодействие лекарств может быть опасным. Основные правила:\n\n⚠️ Сообщайте врачу обо всех принимаемых препаратах\n⚠️ Читайте инструкции о совместимости\n⚠️ Избегайте алкоголя с лекарствами\n⚠️ Некоторые БАДы тоже взаимодействуют с лекарствами\n\nПроверю совместимость конкретных препаратов. Перечислите их названия.`,
            ar: `تفاعل الأدوية قد يكون خطيرًا. القواعد الأساسية:\n\n⚠️ أخبر طبيبك عن جميع الأدوية التي تتناولها\n⚠️ اقرأ تعليمات التوافق\n⚠️ تجنب الكحول مع الأدوية\n⚠️ بعض المكملات الغذائية تتفاعل أيضًا مع الأدوية\n\nيمكنني التحقق من توافق أدوية محددة. يرجى ذكر أسمائها.`,
            en: `Drug interactions can be dangerous. Basic rules:\n\n⚠️ Tell your doctor about all medications you're taking\n⚠️ Read compatibility instructions\n⚠️ Avoid alcohol with medications\n⚠️ Some supplements also interact with drugs\n\nI can check compatibility of specific drugs. Please list their names.`
        };
        return responses[lang];
    }
    
    async getAlternativeResponse(userMessage, lang) {
        // Извлекаем название препарата
        const products = PRODUCTS_DB.products;
        let mentionedDrug = null;
        
        for (const product of products) {
            const name = product.name[lang].toLowerCase();
            if (userMessage.toLowerCase().includes(name.toLowerCase())) {
                mentionedDrug = product;
                break;
            }
        }
        
        if (!mentionedDrug) {
            const responses = {
                ru: "Для поиска аналогов укажите название препарата.",
                ar: "للبحث عن بدائل، يرجى ذكر اسم الدواء.",
                en: "To search for alternatives, please provide the drug name."
            };
            return responses[lang];
        }
        
        // Ищем аналоги в той же категории
        const alternatives = products.filter(p => 
            p.category === mentionedDrug.category && 
            p.id !== mentionedDrug.id &&
            (!p.requiresPrescription || p.requiresPrescription === mentionedDrug.requiresPrescription)
        ).slice(0, 3);
        
        if (alternatives.length === 0) {
            const responses = {
                ru: `К сожалению, аналоги для "${mentionedDrug.name[lang]}" не найдены.`,
                ar: `عذرًا، لم يتم العثور على بدائل لـ "${mentionedDrug.name[lang]}".`,
                en: `Sorry, no alternatives found for "${mentionedDrug.name[lang]}".`
            };
            return responses[lang];
        }
        
        let response = '';
        
        if (lang === 'ru') {
            response = `Найденные аналоги для "${mentionedDrug.name[lang]}":\n\n`;
            alternatives.forEach((alt, index) => {
                response += `${index + 1}. ${alt.name[lang]} - ${alt.price} ${CONFIG.STORE.currency_symbol}\n`;
                response += `   ${alt.description[lang].slice(0, 100)}...\n`;
            });
            response += `\nДля уточнения информации обратитесь к фармацевту.`;
        } else if (lang === 'ar') {
            response = `البدائل الموجودة لـ "${mentionedDrug.name[lang]}":\n\n`;
            alternatives.forEach((alt, index) => {
                response += `${index + 1}. ${alt.name[lang]} - ${alt.price} ${CONFIG.STORE.currency_symbol}\n`;
                response += `   ${alt.description[lang].slice(0, 100)}...\n`;
            });
            response += `\nلمزيد من المعلومات، راجع الصيدلي.`;
        } else {
            response = `Found alternatives for "${mentionedDrug.name[lang]}":\n\n`;
            alternatives.forEach((alt, index) => {
                response += `${index + 1}. ${alt.name[lang]} - ${alt.price} ${CONFIG.STORE.currency_symbol}\n`;
                response += `   ${alt.description[lang].slice(0, 100)}...\n`;
            });
            response += `\nFor more information, consult the pharmacist.`;
        }
        
        return response;
    }
    
    async getSymptomResponse(userMessage, lang) {
        // Ищем товары по симптомам
        const relevantProducts = PRODUCTS_DB.searchBySymptoms(userMessage);
        
        if (relevantProducts.length === 0) {
            const responses = {
                ru: "Рекомендую обратиться к врачу для точной диагностики. Могу предложить общие рекомендации по здоровью.",
                ar: "أنصحك بمراجعة الطبيب للتشخيص الدقيق. يمكنني تقديم نصائح عامة للصحة.",
                en: "I recommend seeing a doctor for accurate diagnosis. I can offer general health advice."
            };
            return responses[lang];
        }
        
        let response = '';
        
        if (lang === 'ru') {
            response = `На основе описанных симптомов могу рекомендовать:\n\n`;
            relevantProducts.slice(0, 5).forEach((product, index) => {
                response += `${index + 1}. ${product.name[lang]} - ${product.price} ${CONFIG.STORE.currency_symbol}\n`;
                response += `   Категория: ${PRODUCTS_DB.getCategory(product.category).name[lang]}\n`;
            });
            response += `\n⚠️ Это рекомендации AI. Для точного назначения проконсультируйтесь с врачом.`;
        } else if (lang === 'ar') {
            response = `بناءً على الأعراض الموصوفة، يمكنني التوصية بـ:\n\n`;
            relevantProducts.slice(0, 5).forEach((product, index) => {
                response += `${index + 1}. ${product.name[lang]} - ${product.price} ${CONFIG.STORE.currency_symbol}\n`;
                response += `   الفئة: ${PRODUCTS_DB.getCategory(product.category).name[lang]}\n`;
            });
            response += `\n⚠️ هذه توصيات الذكاء الاصطناعي. للحصول على وصفة دقيقة، استشر طبيبًا.`;
        } else {
            response = `Based on described symptoms, I can recommend:\n\n`;
            relevantProducts.slice(0, 5).forEach((product, index) => {
                response += `${index + 1}. ${product.name[lang]} - ${product.price} ${CONFIG.STORE.currency_symbol}\n`;
                response += `   Category: ${PRODUCTS_DB.getCategory(product.category).name[lang]}\n`;
            });
            response += `\n⚠️ These are AI recommendations. For accurate prescription, consult a doctor.`;
        }
        
        return response;
    }
    
    getPrescriptionResponse(lang) {
        const responses = {
            ru: `📋 Классификация лекарств:\n\n💊 Безрецептурные (OTC) - можно купить свободно\n⚕️ Рецептурные - требуют назначения врача\n\nВ аптеке Radko-Pharm:\n✅ Можем помочь с оформлением рецепта через онлайн-консультацию\n✅ Есть широкий ассортимент OTC-препаратов\n✅ Принимаем электронные рецепты\n\nУточните название препарата для информации о рецептурном статусе.`,
            ar: `📋 تصنيف الأدوية:\n\n💊 بدون وصفة (OTC) - يمكن شراؤها بحرية\n⚕️ بوصفة طبية - تتطلب وصفة من الطبيب\n\nفي صيدلية Radko-Pharm:\n✅ يمكننا المساعدة في الحصول على وصفة من خلال الاستشارة عبر الإنترنت\n✅ لدينا مجموعة واسعة من أدوية OTC\n✅ نقبل الوصفات الإلكترونية\n\nيرجى ذكر اسم الدواء للحصول على معلومات حول حالة الوصفة.`,
            en: `📋 Medication classification:\n\n💊 Over-the-counter (OTC) - can be purchased freely\n⚕️ Prescription - require doctor's prescription\n\nAt Radko-Pharm pharmacy:\n✅ We can help with prescription through online consultation\n✅ We have wide range of OTC medications\n✅ We accept electronic prescriptions\n\nPlease provide drug name for prescription status information.`
        };
        return responses[lang];
    }
    
    getEmergencyResponse(lang) {
        const emergencyContacts = {
            ru: `🚨 В экстренных случаях:\n\n📞 Скорая помощь: 123\n📞 Пожарная служба: 180\n📞 Полиция: 122\n\nАптека Radko-Pharm:\n📞 Экстренная доставка: ${CONFIG.STORE.phone}\n⏱️ Доставка лекарств за 15 минут при срочном заказе\n👨‍⚕️ Связь с дежурным фармацевтом 24/7\n\nЕсли ситуация критическая - немедленно вызывайте скорую помощь!`,
            ar: `🚨 في الحالات الطارئة:\n\n📞 الإسعاف: 123\n📞 الإطفاء: 180\n📞 الشرطة: 122\n\nصيدلية Radko-Pharm:\n📞 توصيل الطوارئ: ${CONFIG.STORE.phone}\n⏱️ توصيل الأدوية خلال 15 دقيقة للطلبات العاجلة\n👨‍⚕️ اتصال مع الصيدلي المناوب 24/7\n\nإذا كانت الحالة خطيرة - اتصل بالإسعاف فورًا!`,
            en: `🚨 In emergency cases:\n\n📞 Ambulance: 123\n📞 Fire department: 180\n📞 Police: 122\n\nRadko-Pharm pharmacy:\n📞 Emergency delivery: ${CONFIG.STORE.phone}\n⏱️ Medicine delivery in 15 minutes for urgent orders\n👨‍⚕️ 24/7 connection with on-duty pharmacist\n\nIf the situation is critical - call ambulance immediately!`
        };
        return emergencyContacts[lang];
    }
    
    getGeneralResponse(lang) {
        const responses = {
            ru: [
                "Понял ваш вопрос. Как AI-консультант аптеки, могу помочь с информацией о лекарствах, дозировках, побочных эффектах и совместимости препаратов.",
                "Могу помочь найти конкретный препарат или его аналоги в нашем каталоге. Также доступна консультация с живым фармацевтом по видеосвязи.",
                "Наша аптека предлагает экспресс-доставку за 30 минут и цифровую аптечку для отслеживания приема лекарств."
            ],
            ar: [
                "فهمت سؤالك. كمستشار ذكاء اصطناعي للصيدلية، يمكنني المساعدة في معلومات عن الأدوية والجرعات والآثار الجانبية وتوافق الأدوية.",
                "يمكنني المساعدة في العثور على دواء محدد أو بدائله في كتالوجنا. كما تتوفر استشارة مع صيدلي حي عبر الفيديو.",
                "تقدم صيدليتنا توصيل إكسبريس خلال 30 دقيقة وصيدلية رقمية لتتبع تناول الأدوية."
            ],
            en: [
                "Understood your question. As a pharmacy AI consultant, I can help with information about medications, dosages, side effects, and drug compatibility.",
                "I can help find a specific medication or its alternatives in our catalog. Live pharmacist consultation via video is also available.",
                "Our pharmacy offers express delivery in 30 minutes and a digital pharmacy for medication tracking."
            ]
        };
        
        const randomIndex = Math.floor(Math.random() * responses[lang].length);
        return responses[lang][randomIndex];
    }
    
    getMedicalDisclaimer(lang) {
        const disclaimers = {
            ru: "⚠️ Важно: Эта информация носит справочный характер. Не заменяет консультацию врача. В сложных случаях обращайтесь к специалисту.",
            ar: "⚠️ مهم: هذه المعلومات لأغراض مرجعية فقط. لا تحل محل استشارة الطبيب. في الحالات المعقدة، راجع أخصائيًا.",
            en: "⚠️ Important: This information is for reference only. Does not replace doctor's consultation. In complex cases, consult a specialist."
        };
        return disclaimers[lang];
    }
    
    // Показать индикатор набора
    showTypingIndicator() {
        this.isTyping = true;
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }
    }
    
    // Скрыть индикатор набора
    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
    
    // Инициализация распознавания голоса
    initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.speechRecognition = new SpeechRecognition();
            
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = false;
            this.speechRecognition.maxAlternatives = 1;
            
            // Устанавливаем язык в зависимости от текущего
            const langMap = {
                ru: 'ru-RU',
                ar: 'ar-SA',
                en: 'en-US'
            };
            this.speechRecognition.lang = langMap[this.getCurrentLanguage()] || 'en-US';
            
            this.speechRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const input = document.getElementById('message-input');
                if (input) {
                    input.value = transcript;
                }
            };
            
            this.speechRecognition.onerror = (event) => {
                console.log('Speech recognition error:', event.error);
                this.showNotification(this.getText('voice_error'), 'error');
            };
        }
    }
    
    // Инициализация синтеза речи
    initSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
            
            // Создаем список голосов
            this.loadVoices();
            
            // Событие загрузки голосов
            this.synthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
    }
    
    // Загрузка доступных голосов
    loadVoices() {
        if (!this.synthesis) return;
        
        this.voices = this.synthesis.getVoices();
        
        // Выбираем подходящий голос для текущего языка
        const lang = this.getCurrentLanguage();
        const voiceLang = {
            ru: 'ru-RU',
            ar: 'ar-SA',
            en: 'en-US'
        }[lang];
        
        this.selectedVoice = this.voices.find(voice => 
            voice.lang.startsWith(voiceLang)
        ) || this.voices[0];
    }
    
    // Озвучивание текста
    speak(text) {
        if (!this.synthesis || !this.selectedVoice || !this.voiceEnabled) return;
        
        // Останавливаем текущее воспроизведение
        this.synthesis.cancel();
        
        // Создаем utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.selectedVoice;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Устанавливаем язык
        const lang = this.getCurrentLanguage();
        utterance.lang = {
            ru: 'ru-RU',
            ar: 'ar-SA',
            en: 'en-US'
        }[lang];
        
        // Начинаем воспроизведение
        this.synthesis.speak(utterance);
    }
    
    // Переключение голосового режима
    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        
        const button = document.getElementById('voice-toggle');
        if (button) {
            if (this.voiceEnabled) {
                button.classList.add('active');
                button.innerHTML = '<i class="fas fa-microphone-slash"></i><span>' + this.getText('ai_voice_off') + '</span>';
                this.showNotification(this.getText('voice_on'), 'success');
            } else {
                button.classList.remove('active');
                button.innerHTML = '<i class="fas fa-microphone"></i><span>' + this.getText('ai_voice_on') + '</span>';
                this.showNotification(this.getText('voice_off'), 'info');
            }
        }
        
        // Сохраняем настройку
        localStorage.setItem('radko_ai_voice', this.voiceEnabled.toString());
    }
    
    // Начало голосового ввода
    startVoiceInput() {
        if (!this.speechRecognition) {
            this.showNotification(this.getText('voice_not_supported'), 'error');
            return;
        }
        
        try {
            this.speechRecognition.start();
            this.showNotification(this.getText('voice_listening'), 'info');
        } catch (error) {
            console.log('Speech recognition start error:', error);
            this.showNotification(this.getText('voice_error'), 'error');
        }
    }
    
    // Очистка чата
    clearChat() {
        if (confirm(this.getText('chat_clear_confirm'))) {
            this.messages = [];
            localStorage.removeItem('radko_ai_chat');
            this.addWelcomeMessage();
            this.showNotification(this.getText('chat_cleared'), 'success');
        }
    }
    
    // Сохранение чата
    saveChat() {
        const chatText = this.messages.map(msg => {
            return `${msg.type === 'ai' ? 'Dr. DeepSeek' : this.getUserName()}: ${msg.content}`;
        }).join('\n\n');
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `radko-pharm-chat-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(this.getText('chat_saved'), 'success');
    }
    
    // Поделиться чатом
    shareChat() {
        const chatText = this.messages.slice(-10).map(msg => {
            return `${msg.type === 'ai' ? 'Dr. DeepSeek' : this.getUserName()}: ${msg.content}`;
        }).join('\n\n');
        
        if (navigator.share) {
            navigator.share({
                title: 'Radko-Pharm AI Consultation',
                text: chatText,
                url: window.location.href
            }).catch(error => {
                console.log('Share error:', error);
                this.copyToClipboard(chatText);
            });
        } else {
            this.copyToClipboard(chatText);
        }
    }
    
    // Копирование в буфер обмена
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification(this.getText('chat_copied'), 'success');
        }).catch(err => {
            console.log('Copy error:', err);
            this.showNotification(this.getText('chat_copy_error'), 'error');
        });
    }
    
    // Получение текущего языка
    getCurrentLanguage() {
        return localStorage.getItem('radko_lang') || 'ru';
    }
    
    // Получение текста по ключу
    getText(key) {
        // В реальном приложении здесь была бы система i18n
        const translations = {
            'time_just_now': { ru: 'Только что', ar: 'الآن', en: 'Just now' },
            'time_minutes_ago': { ru: 'мин. назад', ar: 'دقيقة', en: 'min ago' },
            'time_hours_ago': { ru: 'ч. назад', ar: 'ساعة', en: 'h ago' },
            'user_default_name': { ru: 'Пользователь', ar: 'المستخدم', en: 'User' },
            'voice_not_supported': { ru: 'Голосовой ввод не поддерживается', ar: 'الإدخال الصوتي غير مدعوم', en: 'Voice input not supported' },
            'voice_listening': { ru: 'Слушаю...', ar: 'أستمع...', en: 'Listening...' },
            'voice_error': { ru: 'Ошибка распознавания голоса', ar: 'خطأ في التعرف على الصوت', en: 'Voice recognition error' },
            'ai_voice_on': { ru: 'Включить голос', ar: 'تشغيل الصوت', en: 'Enable voice' },
            'ai_voice_off': { ru: 'Выключить голос', ar: 'إيقاف الصوت', en: 'Disable voice' },
            'voice_on': { ru: 'Голосовой режим включен', ar: 'تم تشغيل الوضع الصوتي', en: 'Voice mode enabled' },
            'voice_off': { ru: 'Голосовой режим выключен', ar: 'تم إيقاف الوضع الصوتي', en: 'Voice mode disabled' },
            'chat_clear_confirm': { ru: 'Очистить всю историю чата?', ar: 'مسح كل سجل المحادثة؟', en: 'Clear all chat history?' },
            'chat_cleared': { ru: 'Чат очищен', ar: 'تم مسح المحادثة', en: 'Chat cleared' },
            'chat_saved': { ru: 'Чат сохранен', ar: 'تم حفظ المحادثة', en: 'Chat saved' },
            'chat_copied': { ru: 'Чат скопирован', ar: 'تم نسخ المحادثة', en: 'Chat copied' },
            'chat_copy_error': { ru: 'Ошибка копирования', ar: 'خطأ في النسخ', en: 'Copy error' }
        };
        
        const lang = this.getCurrentLanguage();
        return translations[key]?.[lang] || key;
    }
    
    // Показать уведомление
    showNotification(message, type = 'info') {
        // Используем глобальную функцию если она есть
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Загрузка сохраненной настройки голоса
        const savedVoice = localStorage.getItem('radko_ai_voice');
        if (savedVoice !== null) {
            this.voiceEnabled = savedVoice === 'true';
            if (this.voiceEnabled) {
                const button = document.getElementById('voice-toggle');
                if (button) {
                    button.classList.add('active');
                }
            }
        }
    }
}

// Инициализация AI консультанта
let aiConsultant = null;

document.addEventListener('DOMContentLoaded', function() {
    aiConsultant = new AIConsultant();
    
    // Обработка отправки сообщений
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    
    if (sendBtn && messageInput) {
        sendBtn.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                aiConsultant.processMessage(message);
                messageInput.value = '';
            }
        });
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = messageInput.value.trim();
                if (message) {
                    aiConsultant.processMessage(message);
                    messageInput.value = '';
                }
            }
        });
    }
    
    // Обработка быстрых ответов
    document.querySelectorAll('.quick-reply').forEach(btn => {
        btn.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            aiConsultant.processMessage(message);
        });
    });
    
    // Обработка кнопок действий
    const clearBtn = document.getElementById('clear-chat');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => aiConsultant.clearChat());
    }
    
    const saveBtn = document.getElementById('save-chat');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => aiConsultant.saveChat());
    }
    
    const shareBtn = document.getElementById('share-chat');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => aiConsultant.shareChat());
    }
    
    // Голосовой ввод
    const voiceBtn = document.getElementById('voice-input');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => aiConsultant.startVoiceInput());
    }
    
    // Переключение голосового режима
    const voiceToggle = document.getElementById('voice-toggle');
    if (voiceToggle) {
        voiceToggle.addEventListener('click', () => aiConsultant.toggleVoice());
    }
    
    // Обработка функций AI
    document.querySelectorAll('.feature-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            let message = '';
            
            switch(feature) {
                case 'diagnosis':
                    message = aiConsultant.getText('ai_diagnosis_prompt') || 'Помогите с предварительной диагностикой';
                    break;
                case 'interaction':
                    message = aiConsultant.getText('ai_interaction_prompt') || 'Проверьте совместимость препаратов';
                    break;
                case 'dosage':
                    message = aiConsultant.getText('ai_dosage_prompt') || 'Расчитайте дозировку';
                    break;
                case 'reminder':
                    message = aiConsultant.getText('ai_reminder_prompt') || 'Помогите настроить напоминания';
                    break;
            }
            
            aiConsultant.processMessage(message);
        });
    });
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIConsultant;
} else {
    window.AIConsultant = AIConsultant;
}