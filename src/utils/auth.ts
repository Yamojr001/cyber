export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'staff' | 'lecturer';
  name: string;
  profileImage?: string;
  department?: string;
  studentId?: string;
  staffId?: string;
  courses?: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Default users with credentials
const defaultUsers: (User & { password: string })[] = [
  {
    id: '1',
    username: 'student123',
    password: 'student123',
    email: 'student@cybersec.edu',
    role: 'student',
    name: 'Jamilu Yusuf Musa',
    department: 'Cyber Security',
    studentId: 'CS2024001'
  },
  {
    id: '2',
    username: 'staff123',
    password: 'staff123',
    email: 'staff@cybersec.edu',
    role: 'staff',
    name: 'Dr. ',
    department: 'Cyber Security',
    staffId: 'STF001'
  },
  {
    id: '3',
    username: 'lecturer123',
    password: 'lecturer123',
    email: 'lecturer@cybersec.edu',
    role: 'lecturer',
    name: 'Prof. ',
    department: 'Cyber Security',
    staffId: 'LEC001',
    courses: ['CS101', 'CS201', 'CS301']
  }
];

export const initializeAuth = () => {
  const existingUsers = localStorage.getItem('users');
  if (!existingUsers) {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
};

export const login = (credentials: LoginCredentials): User | null => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) =>
    u.username === credentials.username && u.password === credentials.password
  );
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  
  return null;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const updateUserProfile = (updatedUser: Partial<User>) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
  
  if (userIndex !== -1) {
    const updated = { ...users[userIndex], ...updatedUser };
    users[userIndex] = updated;
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password, ...userWithoutPassword } = updated;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  
  return null;
};

export const registerUser = (userData: Omit<User, 'id'> & { password: string }): User | null => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if username already exists
  if (users.find((u: any) => u.username === userData.username)) {
    return null;
  }
  
  const newUser = {
    ...userData,
    id: Date.now().toString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Initialize auth on app start
initializeAuth();