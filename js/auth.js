// ===== AUTHENTICATION SYSTEM =====

// Classes structure
const classes = {
    'klasse1': {
        name: 'Klas 1',
        students: ['leerling1', 'leerling2']
    },
    'klasse2': {
        name: 'Klas 2',
        students: ['leerling3', 'leerling4']
    },
    'klasse3': {
        name: 'Klas 3',
        students: ['leerling5']
    }
};

// User database (in a real app, this would be a backend database)
const users = {
    // Coaches
    'coach1': { 
        username: 'coach1', 
        password: 'Agora2024!', 
        role: 'coach',
        name: 'Mevr. Jensen',
        firstLogin: false,
        challenges: [],
        workshops: [],
        classes: ['klasse1', 'klasse2', 'klasse3']
    },
    'coach2': { 
        username: 'coach2', 
        password: 'Agora2024!', 
        role: 'coach',
        name: 'Dhr. Bakker',
        firstLogin: false,
        challenges: [],
        workshops: [],
        classes: ['klasse1', 'klasse2']
    },
    
    // Leerlingen (students)
    'leerling1': { 
        username: 'leerling1', 
        password: 'TempPass123', 
        role: 'student',
        name: 'Lars de Vries',
        firstLogin: true,
        challenges: [],
        agenda: [],
        todo: [],
        class: 'klasse1'
    },
    'leerling2': { 
        username: 'leerling2', 
        password: 'TempPass456', 
        role: 'student',
        name: 'Emma van Dijk',
        firstLogin: true,
        challenges: [],
        agenda: [],
        todo: [],
        class: 'klasse1'
    },
    'leerling3': { 
        username: 'leerling3', 
        password: 'TempPass789', 
        role: 'student',
        name: 'Sem van der Meer',
        firstLogin: true,
        challenges: [],
        agenda: [],
        todo: [],
        class: 'klasse2'
    },
    'leerling4': { 
        username: 'leerling4', 
        password: 'TempPass101', 
        role: 'student',
        name: 'Sophie Kuiper',
        firstLogin: true,
        challenges: [],
        agenda: [],
        todo: [],
        class: 'klasse2'
    },
    'leerling5': { 
        username: 'leerling5', 
        password: 'TempPass112', 
        role: 'student',
        name: 'Daan van Leeuwen',
        firstLogin: true,
        challenges: [],
        agenda: [],
        todo: [],
        class: 'klasse3'
    }
};

// Predefined challenge templates for coaches
const challengeTemplates = [
    {
        id: 'template1',
        title: 'Onderzoekproject',
        description: 'Voer een onderzoek uit naar een zelfgekozen onderwerp.',
        mainQuestion: 'Hoe los ik dit onderzoeksvraagstuk op?',
        subQuestions: [
            'Wat is de hoofdvraag?',
            'Welke deelvragen zijn nodig?',
            'Hoe verzamel ik data?',
            'Hoe analyseer ik de resultaten?'
        ],
        isTemplate: true
    },
    {
        id: 'template2',
        title: 'Praktijkopdracht',
        description: 'Maak een praktisch product of dienst.',
        mainQuestion: 'Hoe maak ik dit product?',
        subQuestions: [
            'Welke materialen heb ik nodig?',
            'Wat zijn de stappen?',
            'Hoe test ik het resultaat?',
            'Hoe presenteer ik het?'
        ],
        isTemplate: true
    }
];

// ===== AUTH FUNCTIONS =====

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return localStorage.getItem('agora_currentUser') !== null;
}

/**
 * Get current user
 */
function getCurrentUser() {
    const username = localStorage.getItem('agora_currentUser');
    if (username && users[username]) {
        return { ...users[username], username };
    }
    return null;
}

/**
 * Login user
 */
function login(username, password) {
    const user = users[username];
    
    if (!user) {
        return { success: false, message: 'Gebruikersnaam niet gevonden' };
    }
    
    if (user.password !== password) {
        return { success: false, message: 'Verkeerd wachtwoord' };
    }
    
    // Store user in localStorage
    localStorage.setItem('agora_currentUser', username);
    
    return { 
        success: true, 
        message: 'Inloggen gelukt!',
        user: { ...user, username },
        firstLogin: user.firstLogin
    };
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('agora_currentUser');
    window.location.href = 'login.html';
}

/**
 * Change password
 */
function changePassword(currentPassword, newPassword, confirmPassword) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        return { success: false, message: 'Je bent niet ingelogd' };
    }
    
    if (currentUser.password !== currentPassword) {
        return { success: false, message: 'Huidig wachtwoord is onjuist' };
    }
    
    if (newPassword !== confirmPassword) {
        return { success: false, message: 'Nieuwe wachtwoorden komen niet overeen' };
    }
    
    if (newPassword.length < 8) {
        return { success: false, message: 'Wachtwoord moet minimaal 8 tekens lang zijn' };
    }
    
    // Update password
    users[currentUser.username].password = newPassword;
    users[currentUser.username].firstLogin = false;
    
    // Update in localStorage
    localStorage.setItem(`agora_user_${currentUser.username}`, JSON.stringify(users[currentUser.username]));
    
    return { success: true, message: 'Wachtwoord succesvol gewijzigd!' };
}

/**
 * Reset password (for coaches)
 */
function resetPassword(coachUsername, studentUsername, newPassword) {
    const coach = users[coachUsername];
    const student = users[studentUsername];
    
    if (!coach || coach.role !== 'coach') {
        return { success: false, message: 'Alleen coaches kunnen wachtwoorden resetten' };
    }
    
    if (!student) {
        return { success: false, message: 'Leerling niet gevonden' };
    }
    
    if (newPassword.length < 8) {
        return { success: false, message: 'Wachtwoord moet minimaal 8 tekens lang zijn' };
    }
    
    // Reset password
    student.password = newPassword;
    student.firstLogin = true;
    
    return { success: true, message: `Wachtwoord voor ${student.name} is gereset` };
}

/**
 * Check if user is coach
 */
function isCoach() {
    const user = getCurrentUser();
    return user && user.role === 'coach';
}

/**
 * Check if user is student
 */
function isStudent() {
    const user = getCurrentUser();
    return user && user.role === 'student';
}

/**
 * Get all students
 */
function getAllStudents() {
    return Object.values(users).filter(u => u.role === 'student');
}

/**
 * Get all classes
 */
function getAllClasses() {
    return classes;
}

/**
 * Get students in a specific class
 */
function getStudentsInClass(classId) {
    const classInfo = classes[classId];
    if (!classInfo) return [];
    return classInfo.students.map(username => users[username]).filter(u => u);
}

/**
 * Assign challenge to students
 */
function assignChallengeToStudents(coachUsername, challenge, studentUsernames) {
    const coach = users[coachUsername];
    if (!coach || coach.role !== 'coach') {
        return { success: false, message: 'Alleen coaches kunnen challenges toewijzen' };
    }
    
    let assignedCount = 0;
    studentUsernames.forEach(username => {
        const student = users[username];
        if (student && student.role === 'student') {
            if (!student.challenges) {
                student.challenges = [];
            }
            const studentChallenge = {
                ...challenge,
                id: Date.now() + Math.random(),
                assignedBy: coachUsername,
                assignedAt: new Date().toISOString(),
                participants: [username]
            };
            student.challenges.push(studentChallenge);
            assignedCount++;
        }
    });
    
    return { 
        success: true, 
        message: `Challenge toegewezen aan ${assignedCount} leerling(en)`,
        assignedCount 
    };
}

// ===== INITIALIZE AUTH STATE =====

// Check if user needs to change password on first login
function checkFirstLogin() {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.firstLogin) {
        // Redirect to password change page
        window.location.href = 'change-password.html';
    }
}

// Initialize auth state when page loads
window.addEventListener('DOMContentLoaded', function() {
    // Add logout button functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Check if user needs to change password
    if (isLoggedIn() && !window.location.pathname.includes('change-password.html')) {
        checkFirstLogin();
    }
    
    // Update UI based on login state
    updateAuthUI();
});

/**
 * Update UI based on authentication state
 */
function updateAuthUI() {
    const user = getCurrentUser();
    const loginLinks = document.querySelectorAll('.login-link');
    const logoutLinks = document.querySelectorAll('.logout-link');
    const userInfoElements = document.querySelectorAll('.user-info');
    const coachOnlyElements = document.querySelectorAll('.coach-only');
    const studentOnlyElements = document.querySelectorAll('.student-only');
    
    if (user) {
        // Hide login links
        loginLinks.forEach(link => {
            link.style.display = 'none';
            link.style.visibility = 'hidden';
        });
        
        // Show logout links
        logoutLinks.forEach(link => {
            link.style.display = 'block';
            link.style.visibility = 'visible';
        });
        
        // Update user info
        userInfoElements.forEach(el => {
            const nameEl = el.querySelector('.user-name');
            const roleEl = el.querySelector('.user-role');
            
            if (nameEl) nameEl.textContent = user.name;
            if (roleEl) roleEl.textContent = user.role === 'coach' ? 'Coach' : 'Leerling';
        });
        
        // Show/hide coach-only elements
        coachOnlyElements.forEach(el => {
            el.style.display = isCoach() ? 'block' : 'none';
        });
        
        // Show/hide student-only elements
        studentOnlyElements.forEach(el => {
            el.style.display = isStudent() ? 'block' : 'none';
        });
    } else {
        // Show login links
        loginLinks.forEach(link => {
            link.style.display = 'block';
            link.style.visibility = 'visible';
        });
        
        // Hide logout links
        logoutLinks.forEach(link => {
            link.style.display = 'none';
            link.style.visibility = 'hidden';
        });
        
        // Hide coach/student only elements
        coachOnlyElements.forEach(el => el.style.display = 'none');
        studentOnlyElements.forEach(el => el.style.display = 'none');
    }
}
