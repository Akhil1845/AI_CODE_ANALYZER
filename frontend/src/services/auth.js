// CodeLens AI - Authentication Service (Real Local Session & User Management)

const USERS_STORAGE_KEY = 'codelens_users';
const CURRENT_USER_KEY = 'codelens_current_user';

export const auth = {
  // Get all registered users from storage
  getUsers() {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Save users list
  saveUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to persist users:', e);
    }
  },

  // Get current logged-in user
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // Register new user
  signup(name, email, password, platform = 'LeetCode') {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: 'usr_' + Date.now().toString(36),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // in local state
      platform,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    // Auto login
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, platform: newUser.platform };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  // Login
  login(email, password) {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);

    if (!user) {
      // If no users exist at all, offer friendly self-registration hint or check demo
      if (email.toLowerCase() === 'demo@codelens.ai' && password === 'password123') {
        const demoUser = {
          id: 'usr_demo',
          name: 'Demo Engineer',
          email: 'demo@codelens.ai',
          platform: 'LeetCode'
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
        return demoUser;
      }
      throw new Error('Invalid email or password.');
    }

    const sessionUser = { id: user.id, name: user.name, email: user.email, platform: user.platform };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  // Real Password Reset
  resetPassword(email, newPassword) {
    if (!email || !newPassword) {
      throw new Error('Please enter both your registered email and a new password.');
    }
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    let index = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

    if (index === -1) {
      // User doesn't exist in local cache yet - register/provision smoothly
      const newUser = {
        id: 'usr_' + Date.now().toString(36),
        name: cleanEmail.split('@')[0] || 'Developer',
        email: cleanEmail,
        password: newPassword,
        platform: 'LeetCode',
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      this.saveUsers(users);
      const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, platform: newUser.platform };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    }

    // Update existing user password
    users[index].password = newPassword;
    this.saveUsers(users);

    // Auto-login with updated password
    const user = users[index];
    const sessionUser = { id: user.id, name: user.name, email: user.email, platform: user.platform };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  // Logout
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
