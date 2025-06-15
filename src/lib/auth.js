import bcrypt from 'bcryptjs';

export const AUTH_ROLES = {
  ADMIN: 'Admin',
  TEAM_MANAGER: 'Team Manager',
  SALES_AGENT: 'Sales Agent',
  ANALYST: 'Analyst',
  HR: 'HR',
  READ_ONLY_VIEWER: 'Read-only Viewer'
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const login = async (email, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email);

  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    const { passwordHash: _, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return { success: true, user: userWithoutPassword };
  }
  
  return { success: false, error: 'Invalid credentials' };
};

export const signup = async (userData, isAdminSignup = false) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.find(u => u.email === userData.email)) {
    return { success: false, error: 'User already exists' };
  }
  
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(userData.password, salt);

  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    passwordHash,
    role: isAdminSignup ? AUTH_ROLES.ADMIN : (userData.role || AUTH_ROLES.SALES_AGENT),
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  const { passwordHash: _, ...userWithoutPassword } = newUser;
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  
  return { success: true, user: userWithoutPassword };
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const hasPermission = (userRole, requiredRoles) => {
  if (!userRole) return false;
  const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  const roleHierarchy = {
    [AUTH_ROLES.ADMIN]: 5,
    [AUTH_ROLES.TEAM_MANAGER]: 4,
    [AUTH_ROLES.ANALYST]: 3,
    [AUTH_ROLES.HR]: 3,
    [AUTH_ROLES.SALES_AGENT]: 2,
    [AUTH_ROLES.READ_ONLY_VIEWER]: 1
  };

  if (rolesToCheck.includes(AUTH_ROLES.ADMIN) && userRole === AUTH_ROLES.ADMIN) return true;

  return rolesToCheck.some(requiredRole => roleHierarchy[userRole] >= roleHierarchy[requiredRole]);
};


export const initializeDemoUsers = () => {
  const existingUsers = localStorage.getItem('users');
  if (!existingUsers) {
    const salt = bcrypt.genSaltSync(10);
    const demoUsers = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@leadai.com',
        passwordHash: bcrypt.hashSync('admin123', salt),
        role: AUTH_ROLES.ADMIN,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Manager User',
        email: 'manager@leadai.com',
        passwordHash: bcrypt.hashSync('manager123', salt),
        role: AUTH_ROLES.TEAM_MANAGER,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Sales Agent',
        email: 'agent@leadai.com',
        passwordHash: bcrypt.hashSync('agent123', salt),
        role: AUTH_ROLES.SALES_AGENT,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Analyst User',
        email: 'analyst@leadai.com',
        passwordHash: bcrypt.hashSync('analyst123', salt),
        role: AUTH_ROLES.ANALYST,
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'HR User',
        email: 'hr@leadai.com',
        passwordHash: bcrypt.hashSync('hr123', salt),
        role: AUTH_ROLES.HR,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(demoUsers));
  }
};