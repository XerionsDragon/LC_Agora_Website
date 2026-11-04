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
    updateAuthUI();
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
}

function renderCalendar(month, year) {
    const calendar = document.querySelector('.calendar');
    if (!calendar) return;
    
    const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 
                        'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    
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

// ===== UTILITY FUNCTIONS =====

function saveUserData(username, userData) {
    localStorage.setItem(`agora_user_${username}`, JSON.stringify(userData));
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