// ===== AUTHENTICATION SYSTEM =====

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
        workshops: []
    },
    'coach2': { 
        username: 'coach2', 
        password: 'Agora2024!', 
        role: 'coach',
        name: 'Dhr. Bakker',
        firstLogin: false,
        challenges: [],
        workshops: []
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
        todo: []
    },
    'leerling2': { 
        username: 'leerling2', 
        password: 'TempPass456', 
        role: 'student',
        name: 'Emma van Dijk',
        firstLogin: true,
        challenges: [],
        agenda: [],
        todo: []
    },
    'leerling3': { 
        username: 'leerling3', 
        password: 'TempPass789', 
        role: 'student',
        name: 'Sem van der Meer',
        firstLogin: true,
        challenges: [],
        agenda: [],
        todo: []
    },
    'leerling4': { 
        username: 'leerling4', 
        password: 'TempPass101', 
        role: 'student',
        name: 'Sophie Kuiper',
        firstLogin: true,
        challenges: [],
        agenda: [],
        todo: []
    },
    'leerling5': { 
        username: 'leerling5', 
        password: 'TempPass112', 
        role: 'student',
        name: 'Daan van Leeuwen',
        firstLogin: true,
        challenges: [],
        agenda: [],
        todo: []
    }
};

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
    if (isLoggedIn()) {
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
        loginLinks.forEach(link => link.style.display = 'none');
        
        // Show logout links
        logoutLinks.forEach(link => link.style.display = 'block');
        
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
        loginLinks.forEach(link => link.style.display = 'block');
        
        // Hide logout links
        logoutLinks.forEach(link => link.style.display = 'none');
        
        // Hide coach/student only elements
        coachOnlyElements.forEach(el => el.style.display = 'none');
        studentOnlyElements.forEach(el => el.style.display = 'none');
    }
}