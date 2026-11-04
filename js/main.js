// ===== MAIN JAVASCRIPT =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initCalendar();
    initTodoList();
    initChat();
    initChallenges();
    initWorkshops();
    initInspiration();
    
    // Update auth UI
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
});

// ===== NAVIGATION =====

function initNavigation() {
    // Add active class to current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.includes(linkPath)) {
            link.classList.add('active');
        }
    });
    
    // Module card click handlers
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach(card => {
        card.addEventListener('click', function() {
            const module = this.dataset.module;
            if (module) {
                window.location.href = `pages/${module}.html`;
            }
        });
    });
}

// ===== CALENDAR FUNCTIONALITY =====

function initCalendar() {
    const calendar = document.querySelector('.calendar');
    if (!calendar) return;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Generate calendar
    renderCalendar(currentMonth, currentYear);
    
    // Navigation buttons
    const prevMonthBtn = document.querySelector('.calendar-nav .btn-prev');
    const nextMonthBtn = document.querySelector('.calendar-nav .btn-next');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            navigateCalendar(-1);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            navigateCalendar(1);
        });
    }
    
    // Day click handler
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            const date = this.dataset.date;
            if (date) {
                showDayEvents(date);
            }
        });
    });
}

function renderCalendar(month, year) {
    const calendar = document.querySelector('.calendar');
    if (!calendar) return;
    
    const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 
                        'Juli', 'Augustus', 'September', 'Oktober', 'November', 'Decembe'];
    
    const calendarTitle = calendar.querySelector('.calendar-title');
    if (calendarTitle) {
        calendarTitle.textContent = `${monthNames[month]} ${year}`;
    }
    
    const calendarGrid = calendar.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    // Clear existing calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
    dayNames.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.dataset.date = dateStr;
        
        // Check if today
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Check if has events
        const user = getCurrentUser();
        if (user && user.agenda) {
            const hasEvent = user.agenda.some(event => event.date === dateStr);
            if (hasEvent) {
                dayElement.classList.add('has-event');
            }
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Add events list
        const eventsList = document.createElement('ul');
        eventsList.className = 'calendar-events';
        
        if (user && user.agenda) {
            const dayEvents = user.agenda.filter(event => event.date === dateStr);
            dayEvents.forEach(event => {
                const eventItem = document.createElement('li');
                eventItem.textContent = event.title;
                eventsList.appendChild(eventItem);
            });
        }
        
        dayElement.appendChild(eventsList);
        calendarGrid.appendChild(dayElement);
    }
    
    // Add click handlers to new day elements
    const newCalendarDays = calendarGrid.querySelectorAll('.calendar-day:not(.empty)');
    newCalendarDays.forEach(day => {
        day.addEventListener('click', function() {
            const date = this.dataset.date;
            if (date) {
                showDayEvents(date);
            }
        });
    });
}

function navigateCalendar(delta) {
    const calendarTitle = document.querySelector('.calendar-title');
    if (!calendarTitle) return;
    
    const currentTitle = calendarTitle.textContent;
    const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 
                        'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    
    // Parse current month and year
    const parts = currentTitle.split(' ');
    const currentMonthName = parts[0];
    const currentYear = parseInt(parts[1]);
    
    let currentMonth = monthNames.findIndex(name => name === currentMonthName);
    if (currentMonth === -1) {
        currentMonth = new Date().getMonth();
    }
    
    // Calculate new month and year
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    
    if (newMonth < 0) {
        newMonth = 11;
        newYear--;
    } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
    }
    
    renderCalendar(newMonth, newYear);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function showDayEvents(date) {
    const user = getCurrentUser();
    if (!user) {
        alert('Je moet ingelogd zijn om events te bekijken');
        return;
    }
    
    const dayEvents = user.agenda.filter(event => event.date === date);
    
    if (dayEvents.length === 0) {
        alert(`Geen events op ${formatDateForDisplay(date)}`);
        return;
    }
    
    let message = `Events op ${formatDateForDisplay(date)}:\n\n`;
    dayEvents.forEach(event => {
        message += `- ${event.title} (${event.time || 'Hele dag'})\n`;
    });
    
    alert(message);
}

function formatDateForDisplay(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
}

// ===== TODO LIST FUNCTIONALITY =====

function initTodoList() {
    const todoList = document.querySelector('.todo-list');
    if (!todoList) return;
    
    const user = getCurrentUser();
    if (!user) return;
    
    // Load todo items
    loadTodoItems();
    
    // Add new todo form
    const addTodoForm = document.querySelector('.add-todo');
    if (addTodoForm) {
        const input = addTodoForm.querySelector('input');
        const button = addTodoForm.querySelector('button');
        
        if (input && button) {
            addTodoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const text = input.value.trim();
                if (text) {
                    addTodoItem(text);
                    input.value = '';
                }
            });
        }
    }
}

function loadTodoItems() {
    const user = getCurrentUser();
    if (!user) return;
    
    const todoList = document.querySelector('.todo-list');
    if (!todoList) return;
    
    // Clear existing items
    todoList.innerHTML = '';
    
    // Add todo items
    if (user.todo && user.todo.length > 0) {
        user.todo.forEach((todo, index) => {
            addTodoItemToDOM(todo.text, todo.completed, index);
        });
    } else {
        todoList.innerHTML = '<p style="text-align: center; color: var(--text-light);">Geen taken in je to-do lijst</p>';
    }
}

function addTodoItem(text) {
    const user = getCurrentUser();
    if (!user) return;
    
    if (!user.todo) {
        user.todo = [];
    }
    
    user.todo.push({ text, completed: false });
    
    // Save to localStorage
    saveUserData(user.username, user);
    
    // Update UI
    loadTodoItems();
}

function addTodoItemToDOM(text, completed, index) {
    const todoList = document.querySelector('.todo-list');
    if (!todoList) return;
    
    const todoItem = document.createElement('div');
    todoItem.className = `todo-item ${completed ? 'todo-completed' : ''}`;
    todoItem.dataset.index = index;
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', function() {
        toggleTodoComplete(index);
    });
    
    // Text
    const textElement = document.createElement('span');
    textElement.className = 'todo-text';
    textElement.textContent = text;
    
    // Actions
    const actions = document.createElement('div');
    actions.className = 'todo-actions';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', function() {
        deleteTodoItem(index);
    });
    
    actions.appendChild(deleteBtn);
    
    todoItem.appendChild(checkbox);
    todoItem.appendChild(textElement);
    todoItem.appendChild(actions);
    
    todoList.appendChild(todoItem);
}

function toggleTodoComplete(index) {
    const user = getCurrentUser();
    if (!user || !user.todo || index >= user.todo.length) return;
    
    user.todo[index].completed = !user.todo[index].completed;
    
    // Save to localStorage
    saveUserData(user.username, user);
    
    // Update UI
    loadTodoItems();
}

function deleteTodoItem(index) {
    const user = getCurrentUser();
    if (!user || !user.todo || index >= user.todo.length) return;
    
    if (confirm('Weet je zeker dat je deze taak wilt verwijderen?')) {
        user.todo.splice(index, 1);
        
        // Save to localStorage
        saveUserData(user.username, user);
        
        // Update UI
        loadTodoItems();
    }
}

// ===== CHAT FUNCTIONALITY =====

function initChat() {
    // Chat functionality is now handled in forum.html
    // This function is kept for backward compatibility
}

function loadChatHistory() {
    const user = getCurrentUser();
    if (!user) return;
    
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    // Clear existing messages
    chatMessages.innerHTML = '';
    
    // Add sample messages (in a real app, this would be from a database)
    const sampleMessages = [
        { sender: 'coach1', text: 'Hoi allemaal! Vergeet niet dat de workshop vanmorgen om 10:00 uur begint.', time: '08:30', isCurrentUser: false },
        { sender: getCurrentUser().username, text: 'Bedankt voor de herinnering! Ik ben er bij.', time: '08:35', isCurrentUser: true },
        { sender: 'leerling2', text: 'Ik ook! Ik kijk ernaar uit.', time: '08:40', isCurrentUser: false },
        { sender: 'coach1', text: 'Mooi! We gaan vandaag fruit plukken bij de boer. Neem stevige schoenen mee.', time: '08:45', isCurrentUser: false }
    ];
    
    sampleMessages.forEach(msg => {
        addMessageToChat(msg);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage(message) {
    const user = getCurrentUser();
    if (!user) return;
    
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const msg = {
        sender: user.username,
        text: message,
        time: getCurrentTime(),
        isCurrentUser: true
    };
    
    addMessageToChat(msg);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessageToChat(msg) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${msg.isCurrentUser ? 'sent' : 'received'}`;
    
    const info = document.createElement('div');
    info.className = 'message-info';
    
    const sender = document.createElement('span');
    sender.textContent = msg.sender;
    
    const time = document.createElement('span');
    time.textContent = msg.time;
    
    info.appendChild(sender);
    info.appendChild(time);
    
    const text = document.createElement('div');
    text.textContent = msg.text;
    
    messageElement.appendChild(info);
    messageElement.appendChild(text);
    
    chatMessages.appendChild(messageElement);
}

function getCurrentTime() {
    const now = new Date();
    return String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
}

function selectChat(chatId) {
    // Remove active class from all chat items
    const chatListItems = document.querySelectorAll('.chat-list li');
    chatListItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected chat
    const selectedItem = document.querySelector(`.chat-list li[data-chat-id="${chatId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Load messages for selected chat
    loadChatHistory();
}

// ===== CHALLENGES FUNCTIONALITY =====

function initChallenges() {
    // Challenges functionality is now handled in challenges.html
    // This function is kept for backward compatibility
}

function loadChallenges() {
    const user = getCurrentUser();
    if (!user) return;
    
    const challengeGrid = document.querySelector('.challenge-grid');
    if (!challengeGrid) return;
    
    // Clear existing challenges
    challengeGrid.innerHTML = '';
    
    // Get challenges (user's own challenges + shared challenges)
    let challenges = [];
    
    if (user.role === 'coach') {
        // Coaches see all challenges
        Object.values(users).forEach(u => {
            if (u.challenges) {
                challenges = challenges.concat(u.challenges);
            }
        });
    } else {
        // Students see their own challenges
        challenges = user.challenges || [];
    }
    
    if (challenges.length === 0) {
        challengeGrid.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">Geen challenges gevonden</p>';
        return;
    }
    
    challenges.forEach((challenge, index) => {
        addChallengeToDOM(challenge, index);
    });
}

function createChallenge() {
    const user = getCurrentUser();
    if (!user) return;
    
    const form = document.querySelector('.new-challenge-form');
    if (!form) return;
    
    const title = form.querySelector('#challenge-title').value.trim();
    const description = form.querySelector('#challenge-description').value.trim();
    const mainQuestion = form.querySelector('#challenge-main-question').value.trim();
    const subQuestions = form.querySelector('#challenge-sub-questions').value.trim();
    const deadline = form.querySelector('#challenge-deadline').value;
    const participants = form.querySelector('#challenge-participants').value.split(',').map(p => p.trim()).filter(p => p);
    
    if (!title) {
        alert('Vul alstublieft een titel in');
        return;
    }
    
    const challenge = {
        id: Date.now(),
        title,
        description,
        mainQuestion,
        subQuestions: subQuestions.split('\n').filter(q => q.trim()),
        deadline,
        participants: [user.username, ...participants],
        createdBy: user.username,
        createdAt: new Date().toISOString(),
        status: 'active',
        isPublic: false
    };
    
    if (!user.challenges) {
        user.challenges = [];
    }
    
    user.challenges.push(challenge);
    
    // Save to localStorage
    saveUserData(user.username, user);
    
    // Reset form
    form.reset();
    
    // Reload challenges
    loadChallenges();
    
    alert('Challenge succesvol aangemaakt!');
}

function addChallengeToDOM(challenge, index) {
    const challengeGrid = document.querySelector('.challenge-grid');
    if (!challengeGrid) return;
    
    const challengeCard = document.createElement('div');
    challengeCard.className = 'challenge-card';
    
    const title = document.createElement('h3');
    title.className = 'challenge-title';
    title.textContent = challenge.title;
    
    const meta = document.createElement('div');
    meta.className = 'challenge-meta';
    
    const deadline = document.createElement('span');
    deadline.innerHTML = `<i class="fas fa-calendar"></i> Deadline: ${challenge.deadline || 'Geen deadline'}`;
    
    const status = document.createElement('span');
    status.innerHTML = `<i class="fas fa-circle"></i> ${challenge.status}`;
    
    meta.appendChild(deadline);
    meta.appendChild(status);
    
    const description = document.createElement('p');
    description.className = 'challenge-description';
    description.textContent = challenge.description || 'Geen beschrijving';
    
    const participants = document.createElement('div');
    participants.className = 'challenge-participants';
    
    if (challenge.participants && challenge.participants.length > 0) {
        challenge.participants.forEach(participant => {
            const avatar = document.createElement('div');
            avatar.className = 'participant-avatar';
            avatar.textContent = participant.substring(0, 2).toUpperCase();
            participants.appendChild(avatar);
        });
    }
    
    const actions = document.createElement('div');
    actions.className = 'challenge-actions';
    actions.style.display = 'flex';
    actions.style.gap = '10px';
    actions.style.marginTop = '15px';
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn-outline';
    viewBtn.textContent = 'Bekijken';
    viewBtn.addEventListener('click', function() {
        viewChallenge(challenge);
    });
    
    actions.appendChild(viewBtn);
    
    challengeCard.appendChild(title);
    challengeCard.appendChild(meta);
    challengeCard.appendChild(description);
    challengeCard.appendChild(participants);
    challengeCard.appendChild(actions);
    
    challengeGrid.appendChild(challengeCard);
}

function viewChallenge(challenge) {
    // In a real app, this would open a modal or navigate to a detail page
    alert(`Challenge: ${challenge.title}\n\nBeschrijving: ${challenge.description}\n\nHoofdvraag: ${challenge.mainQuestion}\n\nDeadline: ${challenge.deadline || 'Geen deadline'}`);
}

// ===== WORKSHOPS FUNCTIONALITY =====

function initWorkshops() {
    const workshopsPage = document.querySelector('.workshop-grid');
    if (!workshopsPage) return;
    
    const user = getCurrentUser();
    if (!user) return;
    
    // Load workshops
    loadWorkshops();
    
    // New workshop form (coaches only)
    const newWorkshopForm = document.querySelector('.new-workshop-form');
    if (newWorkshopForm && isCoach()) {
        newWorkshopForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createWorkshop();
        });
    }
}

function loadWorkshops() {
    const user = getCurrentUser();
    if (!user) return;
    
    const workshopGrid = document.querySelector('.workshop-grid');
    if (!workshopGrid) return;
    
    // Clear existing workshops
    workshopGrid.innerHTML = '';
    
    // Get workshops (from coaches)
    let workshops = [];
    
    Object.values(users).forEach(u => {
        if (u.role === 'coach' && u.workshops) {
            workshops = workshops.concat(u.workshops);
        }
    });
    
    if (workshops.length === 0) {
        workshopGrid.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">Geen workshops gevonden</p>';
        return;
    }
    
    workshops.forEach((workshop, index) => {
        addWorkshopToDOM(workshop, index);
    });
}

function createWorkshop() {
    const user = getCurrentUser();
    if (!user || !isCoach()) return;
    
    const form = document.querySelector('.new-workshop-form');
    if (!form) return;
    
    const title = form.querySelector('#workshop-title').value.trim();
    const description = form.querySelector('#workshop-description').value.trim();
    const date = form.querySelector('#workshop-date').value;
    const time = form.querySelector('#workshop-time').value;
    const location = form.querySelector('#workshop-location').value.trim();
    const maxParticipants = parseInt(form.querySelector('#workshop-max-participants').value) || 10;
    
    if (!title) {
        alert('Vul alstublieft een titel in');
        return;
    }
    
    const workshop = {
        id: Date.now(),
        title,
        description,
        date,
        time,
        location,
        maxParticipants,
        participants: [],
        createdBy: user.username,
        createdAt: new Date().toISOString()
    };
    
    if (!user.workshops) {
        user.workshops = [];
    }
    
    user.workshops.push(workshop);
    
    // Save to localStorage
    saveUserData(user.username, user);
    
    // Reset form
    form.reset();
    
    // Reload workshops
    loadWorkshops();
    
    alert('Workshop succesvol aangemaakt!');
}

function addWorkshopToDOM(workshop, index) {
    const workshopGrid = document.querySelector('.workshop-grid');
    if (!workshopGrid) return;
    
    const workshopCard = document.createElement('div');
    workshopCard.className = 'workshop-card';
    
    const title = document.createElement('h3');
    title.className = 'workshop-title';
    title.textContent = workshop.title;
    
    const meta = document.createElement('div');
    meta.className = 'workshop-meta';
    
    const dateTime = document.createElement('span');
    dateTime.innerHTML = `<i class="fas fa-calendar"></i> ${workshop.date} om ${workshop.time}`;
    
    const location = document.createElement('span');
    location.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${workshop.location}`;
    
    meta.appendChild(dateTime);
    meta.appendChild(location);
    
    const description = document.createElement('p');
    description.className = 'workshop-description';
    description.textContent = workshop.description || 'Geen beschrijving';
    
    const participants = document.createElement('div');
    participants.className = 'workshop-participants';
    
    if (workshop.participants && workshop.participants.length > 0) {
        workshop.participants.forEach(participant => {
            const avatar = document.createElement('div');
            avatar.className = 'participant-avatar';
            avatar.textContent = participant.substring(0, 2).toUpperCase();
            participants.appendChild(avatar);
        });
    }
    
    const actions = document.createElement('div');
    actions.className = 'workshop-actions';
    actions.style.display = 'flex';
    actions.style.gap = '10px';
    actions.style.marginTop = '15px';
    
    const user = getCurrentUser();
    
    if (user && user.role === 'student') {
        const registerBtn = document.createElement('button');
        registerBtn.className = 'btn btn-primary';
        registerBtn.textContent = 'Inschrijven';
        registerBtn.addEventListener('click', function() {
            registerForWorkshop(workshop);
        });
        actions.appendChild(registerBtn);
    }
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn-outline';
    viewBtn.textContent = 'Bekijken';
    viewBtn.addEventListener('click', function() {
        viewWorkshop(workshop);
    });
    
    actions.appendChild(viewBtn);
    
    workshopCard.appendChild(title);
    workshopCard.appendChild(meta);
    workshopCard.appendChild(description);
    workshopCard.appendChild(participants);
    workshopCard.appendChild(actions);
    
    workshopGrid.appendChild(workshopCard);
}

function registerForWorkshop(workshop) {
    const user = getCurrentUser();
    if (!user || user.role !== 'student') return;
    
    if (workshop.participants.length >= workshop.maxParticipants) {
        alert('Deze workshop is vol!');
        return;
    }
    
    if (workshop.participants.includes(user.username)) {
        alert('Je bent al ingeschreven voor deze workshop');
        return;
    }
    
    workshop.participants.push(user.username);
    
    // Find the coach and update their workshops
    Object.keys(users).forEach(username => {
        if (users[username].role === 'coach' && users[username].workshops) {
            const coachWorkshop = users[username].workshops.find(w => w.id === workshop.id);
            if (coachWorkshop) {
                coachWorkshop.participants = workshop.participants;
                saveUserData(username, users[username]);
            }
        }
    });
    
    alert('Je bent succesvol ingeschreven voor de workshop!');
    loadWorkshops();
}

function viewWorkshop(workshop) {
    alert(`Workshop: ${workshop.title}\n\nBeschrijving: ${workshop.description}\n\nDatum: ${workshop.date}\n\nTijd: ${workshop.time}\n\nLocatie: ${workshop.location}\n\nDeelnemers: ${workshop.participants.length}/${workshop.maxParticipants}`);
}

// ===== INSPIRATION FUNCTIONALITY =====

function initInspiration() {
    const inspirationPage = document.querySelector('.inspiration-grid');
    if (!inspirationPage) return;
    
    const user = getCurrentUser();
    if (!user) return;
    
    // Load inspiration (public challenges)
    loadInspiration();
}

function loadInspiration() {
    const inspirationGrid = document.querySelector('.inspiration-grid');
    if (!inspirationGrid) return;
    
    // Clear existing items
    inspirationGrid.innerHTML = '';
    
    // Get all public challenges
    let publicChallenges = [];
    
    Object.values(users).forEach(u => {
        if (u.challenges) {
            publicChallenges = publicChallenges.concat(u.challenges.filter(c => c.isPublic));
        }
    });
    
    if (publicChallenges.length === 0) {
        inspirationGrid.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">Geen openbare challenges gevonden</p>';
        return;
    }
    
    publicChallenges.forEach((challenge, index) => {
        addInspirationToDOM(challenge, index);
    });
}

function addInspirationToDOM(challenge, index) {
    const inspirationGrid = document.querySelector('.inspiration-grid');
    if (!inspirationGrid) return;
    
    const inspirationCard = document.createElement('div');
    inspirationCard.className = 'inspiration-card';
    
    // Image (placeholder)
    const image = document.createElement('div');
    image.className = 'inspiration-image';
    image.style.background = `linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()})`;
    image.style.display = 'flex';
    image.style.alignItems = 'center';
    image.style.justifyContent = 'center';
    image.style.color = 'white';
    image.style.fontSize = '24px';
    image.style.fontWeight = 'bold';
    image.textContent = challenge.title.substring(0, 3).toUpperCase();
    
    const content = document.createElement('div');
    content.className = 'inspiration-content';
    
    const title = document.createElement('h3');
    title.className = 'inspiration-title';
    title.textContent = challenge.title;
    
    const author = document.createElement('div');
    author.className = 'inspiration-author';
    
    const avatar = document.createElement('div');
    avatar.className = 'participant-avatar';
    avatar.textContent = challenge.createdBy.substring(0, 2).toUpperCase();
    
    const authorName = document.createElement('span');
    authorName.textContent = `Door: ${challenge.createdBy}`;
    
    author.appendChild(avatar);
    author.appendChild(authorName);
    
    const description = document.createElement('p');
    description.className = 'inspiration-description';
    description.textContent = challenge.description || 'Geen beschrijving';
    
    const tags = document.createElement('div');
    tags.className = 'inspiration-tags';
    
    // Add tags based on challenge content
    const challengeTags = ['Challenge', 'Agora', 'Leren'];
    challengeTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tags.appendChild(tagElement);
    });
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Kopieer naar mijn challenges';
    copyBtn.addEventListener('click', function() {
        copyChallengeToMyChallenges(challenge);
    });
    
    content.appendChild(title);
    content.appendChild(author);
    content.appendChild(description);
    content.appendChild(tags);
    content.appendChild(copyBtn);
    
    inspirationCard.appendChild(image);
    inspirationCard.appendChild(content);
    
    inspirationGrid.appendChild(inspirationCard);
}

function copyChallengeToMyChallenges(challenge) {
    const user = getCurrentUser();
    if (!user || user.role !== 'student') return;
    
    if (confirm(`Wil je de challenge "${challenge.title}" kopiëren naar je eigen challenges?`)) {
        const copiedChallenge = { ...challenge };
        copiedChallenge.id = Date.now();
        copiedChallenge.participants = [user.username];
        copiedChallenge.createdBy = user.username;
        copiedChallenge.createdAt = new Date().toISOString();
        copiedChallenge.isPublic = false;
        
        if (!user.challenges) {
            user.challenges = [];
        }
        
        user.challenges.push(copiedChallenge);
        
        // Save to localStorage
        saveUserData(user.username, user);
        
        alert('Challenge succesvol gekopieerd! Je kunt deze nu aanpassen in je eigen challenges.');
    }
}

// ===== UTILITY FUNCTIONS =====

function saveUserData(username, userData) {
    localStorage.setItem(`agora_user_${username}`, JSON.stringify(userData));
    
    // Also update the global users object if it exists
    if (typeof users !== 'undefined' && users[username]) {
        users[username] = { ...users[username], ...userData };
    }
}

function getRandomColor() {
    const colors = ['#2E8B57', '#3498DB', '#F39C12', '#E74C3C', '#9B59B6', '#1ABC9C'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ===== EXPORT FOR USE IN OTHER FILES =====

window.auth = {
    isLoggedIn,
    getCurrentUser,
    login,
    logout,
    changePassword,
    resetPassword,
    isCoach,
    isStudent
};
