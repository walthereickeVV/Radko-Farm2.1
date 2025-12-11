// Цифровая аптечка
class DigitalPharmacy {
    constructor() {
        this.userProfile = null;
        this.medications = [];
        this.reminders = [];
        this.history = [];
        
        this.init();
    }
    
    init() {
        this.loadUserProfile();
        this.loadMedications();
        this.loadReminders();
        this.loadHistory();
        this.setupEventListeners();
        this.renderStats();
    }
    
    // Загрузка профиля пользователя
    loadUserProfile() {
        const saved = localStorage.getItem('radko_user_profile');
        if (saved) {
            this.userProfile = JSON.parse(saved);
        } else {
            this.userProfile = {
                name: '',
                age: '',
                gender: '',
                bloodType: '',
                allergies: [],
                chronicConditions: [],
                emergencyContact: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        }
        
        this.updateProfileUI();
    }
    
    // Сохранение профиля пользователя
    saveUserProfile() {
        localStorage.setItem('radko_user_profile', JSON.stringify(this.userProfile));
        this.updateProfileUI();
    }
    
    // Обновление UI профиля
    updateProfileUI() {
        const userName = document.getElementById('user-name');
        if (userName) {
            userName.textContent = this.userProfile.name || this.getText('user_default_name');
        }
    }
    
    // Загрузка лекарств
    loadMedications() {
        const saved = localStorage.getItem('radko_medications');
        if (saved) {
            this.medications = JSON.parse(saved);
            this.checkExpiredMedications();
        }
        
        this.renderMedications();
    }
    
    // Сохранение лекарств
    saveMedications() {
        localStorage.setItem('radko_medications', JSON.stringify(this.medications));
        this.renderMedications();
        this.renderStats();
        this.updateReminders();
    }
    
    // Загрузка напоминаний
    loadReminders() {
        const saved = localStorage.getItem('radko_reminders');
        if (saved) {
            this.reminders = JSON.parse(saved);
        }
        
        this.renderReminders();
    }
    
    // Сохранение напоминаний
    saveReminders() {
        localStorage.setItem('radko_reminders', JSON.stringify(this.reminders));
        this.renderReminders();
    }
    
    // Загрузка истории
    loadHistory() {
        const saved = localStorage.getItem('radko_medication_history');
        if (saved) {
            this.history = JSON.parse(saved);
        }
        
        this.renderHistory();
    }
    
    // Сохранение истории
    saveHistory() {
        localStorage.setItem('radko_medication_history', JSON.stringify(this.history));
        this.renderHistory();
    }
    
    // Добавление лекарства
    addMedication(medicationData) {
        const medication = {
            id: Date.now() + Math.random(),
            name: medicationData.name,
            dosage: medicationData.dosage,
            frequency: medicationData.frequency,
            startDate: medicationData.startDate,
            endDate: medicationData.endDate,
            notes: medicationData.notes,
            status: 'active',
            createdAt: new Date().toISOString(),
            lastTaken: null,
            adherence: 0,
            stock: medicationData.stock || 30,
            requiresRefill: medicationData.stock <= 7,
            reminders: medicationData.setReminders ? this.createReminders(medicationData) : []
        };
        
        this.medications.push(medication);
        this.saveMedications();
        
        // Добавляем в историю
        this.addToHistory('medication_added', {
            medicationName: medication.name,
            date: new Date().toISOString()
        });
        
        this.showNotification(
            `${medication.name} ${this.getText('medication_added_success')}`,
            'success'
        );
        
        return medication;
    }
    
    // Обновление лекарства
    updateMedication(id, updates) {
        const index = this.medications.findIndex(m => m.id === id);
        if (index !== -1) {
            this.medications[index] = {
                ...this.medications[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            this.saveMedications();
            
            this.showNotification(
                `${this.medications[index].name} ${this.getText('medication_updated')}`,
                'success'
            );
            
            return true;
        }
        return false;
    }
    
    // Удаление лекарства
    removeMedication(id) {
        const medication = this.medications.find(m => m.id === id);
        if (medication) {
            this.medications = this.medications.filter(m => m.id !== id);
            this.saveMedications();
            
            // Удаляем связанные напоминания
            this.reminders = this.reminders.filter(r => r.medicationId !== id);
            this.saveReminders();
            
            // Добавляем в историю
            this.addToHistory('medication_removed', {
                medicationName: medication.name,
                date: new Date().toISOString()
            });
            
            this.showNotification(
                `${medication.name} ${this.getText('medication_removed')}`,
                'info'
            );
            
            return true;
        }
        return false;
    }
    
    // Отметка приема лекарства
    markMedicationTaken(id, time = new Date().toISOString()) {
        const medication = this.medications.find(m => m.id === id);
        if (!medication) return false;
        
        // Обновляем статус
        medication.lastTaken = time;
        medication.stock = Math.max(0, medication.stock - 1);
        medication.requiresRefill = medication.stock <= 7;
        
        // Рассчитываем приверженность
        this.calculateAdherence(medication);
        
        this.saveMedications();
        
        // Добавляем в историю
        this.addToHistory('medication_taken', {
            medicationName: medication.name,
            dosage: medication.dosage,
            time: time
        });
        
        // Показываем уведомление
        this.showNotification(
            `${medication.name} ${this.getText('medication_taken_success')}`,
            'success'
        );
        
        // Воспроизводим звук
        this.playSound('notification');
        
        return true;
    }
    
    // Пропуск приема
    markMedicationMissed(id) {
        const medication = this.medications.find(m => m.id === id);
        if (!medication) return false;
        
        // Добавляем в историю
        this.addToHistory('medication_missed', {
            medicationName: medication.name,
            time: new Date().toISOString()
        });
        
        // Снижаем приверженность
        medication.adherence = Math.max(0, medication.adherence - 5);
        this.saveMedications();
        
        this.showNotification(
            `${medication.name} ${this.getText('medication_missed')}`,
            'warning'
        );
        
        return true;
    }
    
    // Расчет приверженности
    calculateAdherence(medication) {
        if (!medication.startDate) return 0;
        
        const start = new Date(medication.startDate);
        const now = new Date();
        const days = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
        
        if (days <= 0) return 100;
        
        // Предполагаем идеальное соблюдение для примера
        // В реальном приложении здесь была бы сложная логика
        medication.adherence = Math.min(100, Math.floor(Math.random() * 20) + 80);
    }
    
    // Создание напоминаний
    createReminders(medicationData) {
        const reminders = [];
        const times = this.parseFrequency(medicationData.frequency);
        
        times.forEach(time => {
            reminders.push({
                id: Date.now() + Math.random(),
                medicationId: null, // Будет установлено после создания лекарства
                time: time,
                enabled: true,
                days: [1, 2, 3, 4, 5, 6, 7], // Все дни недели
                createdAt: new Date().toISOString()
            });
        });
        
        return reminders;
    }
    
    // Парсинг частоты приема
    parseFrequency(frequency) {
        switch(frequency) {
            case '1':
                return ['08:00'];
            case '2':
                return ['08:00', '20:00'];
            case '3':
                return ['08:00', '14:00', '20:00'];
            case '4':
                return ['08:00', '12:00', '16:00', '20:00'];
            default:
                return ['08:00'];
        }
    }
    
    // Обновление напоминаний
    updateReminders() {
        // Создаем напоминания для всех активных лекарств
        this.medications.forEach(medication => {
            if (medication.reminders && medication.reminders.length > 0) {
                medication.reminders.forEach(reminder => {
                    reminder.medicationId = medication.id;
                    
                    // Проверяем, есть ли уже такое напоминание
                    const existing = this.reminders.find(r => 
                        r.medicationId === medication.id && 
                        r.time === reminder.time
                    );
                    
                    if (!existing) {
                        this.reminders.push(reminder);
                    }
                });
            }
        });
        
        this.saveReminders();
        this.setupNotificationAlerts();
    }
    
    // Настройка уведомлений
    setupNotificationAlerts() {
        // В реальном приложении здесь была бы интеграция с Notification API
        console.log('Setting up medication reminders...');
        
        // Пример простого оповещения
        this.reminders.forEach(reminder => {
            if (reminder.enabled) {
                const medication = this.medications.find(m => m.id === reminder.medicationId);
                if (medication) {
                    // Проверяем время
                    const now = new Date();
                    const [hours, minutes] = reminder.time.split(':').map(Number);
                    const reminderTime = new Date();
                    reminderTime.setHours(hours, minutes, 0, 0);
                    
                    // Разница в минутах
                    const diff = (reminderTime - now) / (1000 * 60);
                    
                    if (diff > 0 && diff <= 60) {
                        // Показываем уведомление за час до приема
                        setTimeout(() => {
                            this.showNotification(
                                `${this.getText('reminder_notification')}: ${medication.name} ${medication.dosage}`,
                                'info'
                            );
                            this.playSound('reminder');
                        }, diff * 60 * 1000);
                    }
                }
            }
        });
    }
    
    // Проверка просроченных лекарств
    checkExpiredMedications() {
        const today = new Date();
        
        this.medications.forEach(medication => {
            if (medication.endDate) {
                const endDate = new Date(medication.endDate);
                if (endDate < today) {
                    medication.status = 'expired';
                    this.showNotification(
                        `${medication.name} ${this.getText('medication_expired')}`,
                        'warning'
                    );
                }
            }
            
            // Проверка остатка
            if (medication.stock <= 0) {
                medication.status = 'out_of_stock';
            }
        });
        
        this.saveMedications();
    }
    
    // Добавление в историю
    addToHistory(type, data) {
        this.history.unshift({
            id: Date.now() + Math.random(),
            type: type,
            data: data,
            timestamp: new Date().toISOString()
        });
        
        // Ограничиваем историю последними 100 записями
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }
        
        this.saveHistory();
    }
    
    // Отрисовка лекарств
    renderMedications() {
        const container = document.querySelector('.medications-grid');
        const emptyState = document.getElementById('empty-meds');
        
        if (!container) return;
        
        if (this.medications.length === 0) {
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            container.innerHTML = '';
            return;
        }
        
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        const lang = this.getCurrentLanguage();
        const activeMeds = this.medications.filter(m => m.status === 'active');
        
        container.innerHTML = activeMeds.map(medication => {
            const category = this.getMedicationCategory(medication);
            const status = this.getMedicationStatus(medication);
            
            return `
                <div class="medication-card" data-id="${medication.id}">
                    <div class="medication-header">
                        <h3 class="medication-name">${medication.name}</h3>
                        <span class="medication-status ${status.class}">${status.text[lang]}</span>
                    </div>
                    
                    <div class="medication-details">
                        <div class="detail-row">
                            <span class="detail-label">${this.getText('dosage')}:</span>
                            <span class="detail-value">${medication.dosage}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${this.getText('frequency')}:</span>
                            <span class="detail-value">${this.getFrequencyText(medication.frequency, lang)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${this.getText('stock')}:</span>
                            <span class="detail-value ${medication.stock <= 7 ? 'warning' : ''}">
                                ${medication.stock} ${this.getText('units')}
                                ${medication.stock <= 7 ? ' ⚠️' : ''}
                            </span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">${this.getText('adherence')}:</span>
                            <span class="detail-value">
                                <div class="adherence-bar">
                                    <div class="adherence-fill" style="width: ${medication.adherence || 0}%"></div>
                                    <span class="adherence-text">${medication.adherence || 0}%</span>
                                </div>
                            </span>
                        </div>
                    </div>
                    
                    <div class="medication-actions">
                        <button class="btn btn-sm btn-success mark-taken" data-id="${medication.id}">
                            <i class="fas fa-check"></i> ${this.getText('btn_taken')}
                        </button>
                        <button class="btn btn-sm btn-warning mark-missed" data-id="${medication.id}">
                            <i class="fas fa-times"></i> ${this.getText('btn_missed')}
                        </button>
                        <button class="btn btn-sm btn-info edit-medication" data-id="${medication.id}">
                            <i class="fas fa-edit"></i> ${this.getText('btn_edit')}
                        </button>
                        <button class="btn btn-sm btn-danger remove-medication" data-id="${medication.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    
                    ${medication.notes ? `
                        <div class="medication-notes">
                            <strong>${this.getText('notes')}:</strong> ${medication.notes}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        // Добавляем обработчики событий
        this.addMedicationEventListeners();
    }
    
    // Отрисовка напоминаний
    renderReminders() {
        const container = document.querySelector('.reminders-list');
        if (!container) return;
        
        const activeReminders = this.reminders.filter(r => r.enabled);
        
        if (activeReminders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <h4>${this.getText('no_reminders')}</h4>
                    <p>${this.getText('no_reminders_text')}</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = activeReminders.map(reminder => {
            const medication = this.medications.find(m => m.id === reminder.medicationId);
            if (!medication) return '';
            
            return `
                <div class="reminder-card" data-id="${reminder.id}">
                    <div class="reminder-header">
                        <div class="reminder-time">
                            <i class="fas fa-clock"></i>
                            <span>${reminder.time}</span>
                        </div>
                        <div class="reminder-actions">
                            <button class="btn btn-sm toggle-reminder" data-id="${reminder.id}">
                                <i class="fas fa-bell-slash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="reminder-body">
                        <h4>${medication.name}</h4>
                        <p>${medication.dosage} • ${this.getFrequencyText(medication.frequency, this.getCurrentLanguage())}</p>
                    </div>
                    <div class="reminder-footer">
                        <span class="days">
                            ${this.getDaysText(reminder.days, this.getCurrentLanguage())}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
        
        this.addReminderEventListeners();
    }
    
    // Отрисовка истории
    renderHistory() {
        const container = document.getElementById('history-tab');
        if (!container) return;
        
        // Создаем календарь для текущего месяца
        this.renderCalendar();
    }
    
    // Отрисовка календаря
    renderCalendar() {
        const container = document.getElementById('calendar');
        if (!container) return;
        
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        // Обновляем заголовок месяца
        const monthTitle = document.getElementById('current-month');
        if (monthTitle) {
            const monthNames = this.getMonthNames();
            monthTitle.textContent = `${monthNames[this.getCurrentLanguage()][month]} ${year}`;
        }
        
        // Получаем первый день месяца
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Получаем день недели первого дня
        const firstDayIndex = firstDay.getDay();
        
        let calendarHTML = '';
        
        // Добавляем заголовки дней недели
        const dayNames = this.getDayNames();
        calendarHTML += '<div class="calendar-weekdays">';
        dayNames[this.getCurrentLanguage()].forEach(day => {
            calendarHTML += `<div class="calendar-weekday">${day}</div>`;
        });
        calendarHTML += '</div>';
        
        // Добавляем дни
        calendarHTML += '<div class="calendar-days">';
        
        // Пустые клетки до первого дня
        for (let i = 0; i < firstDayIndex; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        // Дни месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            
            // Проверяем, есть ли события в этот день
            const events = this.getEventsForDate(dateStr);
            const hasEvents = events.length > 0;
            
            calendarHTML += `
                <div class="calendar-day ${hasEvents ? 'has-events' : ''} ${day === now.getDate() ? 'today' : ''}" 
                     data-date="${dateStr}">
                    <span class="day-number">${day}</span>
                    ${hasEvents ? `
                        <div class="day-events">
                            ${events.map(event => `
                                <div class="day-event ${event.type}">
                                    <i class="fas fa-${this.getEventIcon(event.type)}"></i>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        container.innerHTML = calendarHTML;
        
        // Добавляем обработчики событий для дней
        this.addCalendarEventListeners();
    }
    
    // Получение событий для даты
    getEventsForDate(dateStr) {
        return this.history.filter(record => {
            const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
            return recordDate === dateStr;
        }).slice(0, 3); // Максимум 3 события на день
    }
    
    // Отрисовка статистики
    renderStats() {
        const totalMeds = document.getElementById('total-meds');
        const activeReminders = document.getElementById('active-reminders');
        const refillSoon = document.getElementById('refill-soon');
        
        if (totalMeds) {
            totalMeds.textContent = this.medications.filter(m => m.status === 'active').length;
        }
        
        if (activeReminders) {
            activeReminders.textContent = this.reminders.filter(r => r.enabled).length;
        }
        
        if (refillSoon) {
            refillSoon.textContent = this.medications.filter(m => m.requiresRefill).length;
        }
    }
    
    // Категория лекарства
    getMedicationCategory(medication) {
        // В реальном приложении здесь была бы логика определения категории
        return 'general';
    }
    
    // Статус лекарства
    getMedicationStatus(medication) {
        if (medication.status === 'expired') {
            return {
                class: 'status-expired',
                text: {
                    ru: 'Просрочено',
                    ar: 'منتهي الصلاحية',
                    en: 'Expired'
                }
            };
        } else if (medication.status === 'out_of_stock') {
            return {
                class: 'status-out-of-stock',
                text: {
                    ru: 'Закончилось',
                    ar: 'نفد',
                    en: 'Out of stock'
                }
            };
        } else if (medication.requiresRefill) {
            return {
                class: 'status-refill',
                text: {
                    ru: 'Пополнить',
                    ar: 'إعادة التعبئة',
                    en: 'Refill'
                }
            };
        } else {
            return {
                class: 'status-active',
                text: {
                    ru: 'Активно',
                    ar: 'نشط',
                    en: 'Active'
                }
            };
        }
    }
    
    // Текст частоты приема
    getFrequencyText(frequency, lang) {
        const texts = {
            '1': {
                ru: '1 раз в день',
                ar: 'مرة واحدة يوميًا',
                en: 'Once daily'
            },
            '2': {
                ru: '2 раза в день',
                ar: 'مرتين يوميًا',
                en: 'Twice daily'
            },
            '3': {
                ru: '3 раза в день',
                ar: 'ثلاث مرات يوميًا',
                en: 'Three times daily'
            },
            '4': {
                ru: '4 раза в день',
                ar: 'أربع مرات يوميًا',
                en: 'Four times daily'
            }
        };
        
        return texts[frequency]?.[lang] || frequency;
    }
    
    // Текст дней недели
    getDaysText(days, lang) {
        const dayNames = this.getDayNames();
        if (days.length === 7) {
            return this.getText('every_day');
        }
        
        return days.map(day => dayNames[lang][day - 1].slice(0, 1)).join(', ');
    }
    
    // Названия месяцев
    getMonthNames() {
        return {
            ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
            en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        };
    }
    
    // Названия дней недели
    getDayNames() {
        return {
            ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            ar: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
            en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        };
    }
    
    // Иконка события
    getEventIcon(eventType) {
        const icons = {
            'medication_taken': 'check-circle',
            'medication_missed': 'times-circle',
            'medication_added': 'plus-circle',
            'medication_removed': 'minus-circle'
        };
        
        return icons[eventType] || 'circle';
    }
    
    // Добавление обработчиков событий для лекарств
    addMedicationEventListeners() {
        // Отметить как принятое
        document.querySelectorAll('.mark-taken').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.markMedicationTaken(id);
            });
        });
        
        // Отметить как пропущенное
        document.querySelectorAll('.mark-missed').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.markMedicationMissed(id);
            });
        });
        
        // Редактировать
        document.querySelectorAll('.edit-medication').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.openEditModal(id);
            });
        });
        
        // Удалить
        document.querySelectorAll('.remove-medication').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                if (confirm(this.getText('confirm_remove_medication'))) {
                    this.removeMedication(id);
                }
            });
        });
    }
    
    // Добавление обработчиков для напоминаний
    addReminderEventListeners() {
        document.querySelectorAll('.toggle-reminder').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.toggleReminder(id);
            });
        });
    }
    
    // Добавление обработчиков для календаря
    addCalendarEventListeners() {
        document.querySelectorAll('.calendar-day.has-events').forEach(day => {
            day.addEventListener('click', () => {
                const date = day.getAttribute('data-date');
                this.showDateEvents(date);
            });
        });
    }
    
    // Переключение напоминания
    toggleReminder(id) {
        const reminder = this.reminders.find(r => r.id === id);
        if (reminder) {
            reminder.enabled = !reminder.enabled;
            this.saveReminders();
            
            const medication = this.medications.find(m => m.id === reminder.medicationId);
            if (medication) {
                this.showNotification(
                    `${this.getText('reminder')} ${medication.name} ${reminder.enabled ? this.getText('enabled') : this.getText('disabled')}`,
                    reminder.enabled ? 'success' : 'info'
                );
            }
        }
    }
    
    // Показать события дня
    showDateEvents(dateStr) {
        const events = this.getEventsForDate(dateStr);
        if (events.length === 0) return;
        
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString(this.getCurrentLanguage(), {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        let message = `${this.getText('events_for')} ${formattedDate}:\n\n`;
        
        events.forEach(event => {
            const time = new Date(event.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            switch(event.type) {
                case 'medication_taken':
                    message += `✅ ${time}: ${event.data.medicationName} ${event.data.dosage}\n`;
                    break;
                case 'medication_missed':
                    message += `❌ ${time}: ${event.data.medicationName}\n`;
                    break;
                case 'medication_added':
                    message += `➕ ${time}: ${event.data.medicationName}\n`;
                    break;
                case 'medication_removed':
                    message += `➖ ${time}: ${event.data.medicationName}\n`;
                    break;
            }
        });
        
        alert(message);
    }
    
    // Открытие модального окна редактирования
    openEditModal(id) {
        const medication = this.medications.find(m => m.id === id);
        if (!medication) return;
        
        // В реальном приложении здесь было бы модальное окно
        console.log('Edit medication:', medication);
        this.showNotification(this.getText('edit_feature_coming_soon'), 'info');
    }
    
    // Получение текущего языка
    getCurrentLanguage() {
        return localStorage.getItem('radko_lang') || 'ru';
    }
    
    // Получение текста по ключу
    getText(key) {
        const translations = {
            'user_default_name': { ru: 'Гость', ar: 'زائر', en: 'Guest' },
            'medication_added_success': { ru: 'добавлено в аптечку', ar: 'تمت الإضافة إلى الصيدلية', en: 'added to pharmacy' },
            'medication_updated': { ru: 'обновлено', ar: 'تم التحديث', en: 'updated' },
            'medication_removed': { ru: 'удалено из аптечки', ar: 'تم الحذف من الصيدلية', en: 'removed from pharmacy' },
            'medication_taken_success': { ru: 'отмечено как принятое', ar: 'تم وضع علامة كمأخوذ', en: 'marked as taken' },
            'medication_missed': { ru: 'отмечено как пропущенное', ar: 'تم وضع علامة كفات', en: 'marked as missed' },
            'medication_expired': { ru: 'просрочено!', ar: 'منتهي الصلاحية!', en: 'expired!' },
            'dosage': { ru: 'Дозировка', ar: 'الجرعة', en: 'Dosage' },
            'frequency': { ru: 'Частота', ar: 'التكرار', en: 'Frequency' },
            'stock': { ru: 'Остаток', ar: 'المخزون', en: 'Stock' },
            'units': { ru: 'ед.', ar: 'وحدة', en: 'units' },
            'adherence': { ru: 'Приверженность', ar: 'الالتزام', en: 'Adherence' },
            'btn_taken': { ru: 'Принял', ar: 'أخذت', en: 'Taken' },
            'btn_missed': { ru: 'Пропустил', ar: 'فات', en: 'Missed' },
            'btn_edit': { ru: 'Изменить', ar: 'تعديل', en: 'Edit' },
            'notes': { ru: 'Примечания', ar: 'ملاحظات', en: 'Notes' },
            'no_reminders': { ru: 'Нет напоминаний', ar: 'لا توجد تذكيرات', en: 'No reminders' },
            'no_reminders_text': { ru: 'Добавьте лекарства с напоминаниями', ar: 'أضف أدوية مع تذكيرات', en: 'Add medications with reminders' },
            'every_day': { ru: 'Каждый день', ar: 'كل يوم', en: 'Every day' },
            'reminder_notification': { ru: 'Время принять лекарство', ar: 'حان وقت تناول الدواء', en: 'Time to take medication' },
            'reminder': { ru: 'Напоминание для', ar: 'تذكير لـ', en: 'Reminder for' },
            'enabled': { ru: 'включено', ar: 'مفعل', en: 'enabled' },
            'disabled': { ru: 'выключено', ar: 'معطل', en: 'disabled' },
            'events_for': { ru: 'События за', ar: 'أحداث في', en: 'Events for' },
            'confirm_remove_medication': { ru: 'Удалить это лекарство из аптечки?', ar: 'حذف هذا الدواء من الصيدلية؟', en: 'Remove this medication from pharmacy?' },
            'edit_feature_coming_soon': { ru: 'Функция редактирования скоро появится', ar: 'ستتوفر ميزة التحرير قريبًا', en: 'Edit feature coming soon' }
        };
        
        const lang = this.getCurrentLanguage();
        return translations[key]?.[lang] || key;
    }
    
    // Показать уведомление
    showNotification(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
    
    // Воспроизвести звук
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
    
    // Настройка обработчиков событий UI
    setupEventListeners() {
        // Добавление лекарства
        const addBtn = document.getElementById('add-medication');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddMedicationModal());
        }
        
        // Редактирование профиля
        const editProfileBtn = document.getElementById('edit-profile');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.openProfileModal());
        }
        
        // Переключение табов
        document.querySelectorAll('.pharmacy-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
        
        // Навигация по календарю
        const prevMonth = document.querySelector('.prev-month');
        const nextMonth = document.querySelector('.next-month');
        
        if (prevMonth) {
            prevMonth.addEventListener('click', () => this.navigateCalendar(-1));
        }
        
        if (nextMonth) {
            nextMonth.addEventListener('click', () => this.navigateCalendar(1));
        }
    }
    
    // Открытие модального окна добавления лекарства
    openAddMedicationModal() {
        // В реальном приложении здесь было бы сложное модальное окно
        const medicationData = {
            name: prompt(this.getText('enter_medication_name')) || 'Лекарство',
            dosage: prompt(this.getText('enter_dosage')) || '1 таблетка',
            frequency: prompt(this.getText('enter_frequency') + ' (1-4)') || '1',
            startDate: new Date().toISOString().split('T')[0],
            endDate: null,
            notes: prompt(this.getText('enter_notes')) || '',
            setReminders: confirm(this.getText('set_reminders_confirm')),
            stock: parseInt(prompt(this.getText('enter_stock')) || '30')
        };
        
        if (medicationData.name && medicationData.dosage) {
            this.addMedication(medicationData);
        }
    }
    
    // Открытие модального окна профиля
    openProfileModal() {
        const name = prompt(this.getText('enter_name'), this.userProfile.name);
        if (name !== null) {
            this.userProfile.name = name;
            this.saveUserProfile();
        }
    }
    
    // Переключение табов
    switchTab(tabId) {
        // Скрываем все табы
        document.querySelectorAll('.pharmacy-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Показываем выбранный таб
        const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(`${tabId}-tab`);
        
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
        
        // Обновляем контент таба
        if (tabId === 'history') {
            this.renderCalendar();
        } else if (tabId === 'reports') {
            this.renderReports();
        }
    }
    
    // Навигация по календарю
    navigateCalendar(direction) {
        // В реальном приложении здесь была бы логика изменения месяца
        console.log('Navigate calendar:', direction);
        this.showNotification(this.getText('calendar_navigation_coming_soon'), 'info');
    }
    
    // Отрисовка отчетов
    renderReports() {
        // В реальном приложении здесь были бы графики Chart.js
        const adherenceChart = document.getElementById('adherence-chart');
        const timeChart = document.getElementById('time-chart');
        
        if (adherenceChart) {
            adherenceChart.innerHTML = `
                <div class="chart-placeholder">
                    <i class="fas fa-chart-line"></i>
                    <p>${this.getText('chart_coming_soon')}</p>
                </div>
            `;
        }
        
        if (timeChart) {
            timeChart.innerHTML = `
                <div class="chart-placeholder">
                    <i class="fas fa-chart-pie"></i>
                    <p>${this.getText('chart_coming_soon')}</p>
                </div>
            `;
        }
    }
}

// Инициализация цифровой аптечки
let digitalPharmacy = null;

document.addEventListener('DOMContentLoaded', function() {
    digitalPharmacy = new DigitalPharmacy();
    
    // Добавление первого лекарства
    const addFirstBtn = document.getElementById('add-first-med');
    if (addFirstBtn) {
        addFirstBtn.addEventListener('click', () => digitalPharmacy.openAddMedicationModal());
    }
    
    // Импорт рецепта
    const importBtn = document.getElementById('import-prescription');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            digitalPharmacy.showNotification(
                digitalPharmacy.getText('import_feature_coming_soon'),
                'info'
            );
        });
    }
    
    // Экспорт данных
    const exportBtn = document.getElementById('export-pharmacy');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = {
                profile: digitalPharmacy.userProfile,
                medications: digitalPharmacy.medications,
                history: digitalPharmacy.history,
                exportedAt: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `radko-pharmacy-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            digitalPharmacy.showNotification(
                digitalPharmacy.getText('export_success'),
                'success'
            );
        });
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DigitalPharmacy;
} else {
    window.DigitalPharmacy = DigitalPharmacy;
}