// Data storage utilities for the cyber security department website

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  creditHours: number;
  lecturer?: string;
}

export interface Newsletter {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'event' | 'notice';
  important?: boolean;
}

export interface Timetable {
  id: string;
  courseCode: string;
  courseName: string;
  day: string;
  time: string;
  room: string;
  lecturer: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  date: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  dueDate: string;
  uploadedBy: string;
  attachments?: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  courseCode: string;
  uploadedBy: string;
  date: string;
  attachments?: string[];
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

// Initialize default data
const defaultCourses: Course[] = [
  {
    id: '1',
    code: 'COS202',
    name: 'Computer Programming II',
    description: 'Introduction to programming concepts using Python. Covers basic syntax, data structures, and algorithms.',
    creditHours: 3
  },
  {
    id: '2',
    code: 'CS201',
    name: 'Network Security',
    description: 'Advanced network security protocols, intrusion detection systems, and network forensics.',
    creditHours: 4
  },
  {
    id: '3',
    code: 'FUD-CYB202',
    name: 'Threats Attacks and Vulnerabilities',
    description: 'Comprehensive study of various types of cyber threats, attack vectors, and vulnerabilities in systems.',
    creditHours: 2
  },
  {
    id: '4',
    code: 'FUD-CYB204',
    name: 'Linux System Administration',
    description: 'In-depth exploration of Linux operating system, including installation, configuration, and administration tasks.',
    creditHours: 3
  },
  {
    id: '5',
    code: 'GST223',
    name: 'Introduction to Entrepreneurship Studies',
    description: 'Hands-on experience with entrepreneurial thinking, business model development, and startup methodologies.',
    creditHours: 3
  }
];

const defaultNewsletters: Newsletter[] = [
  {
    id: '1',
    title: 'Cybersecurity Awareness Month',
    content: 'October is recognized as National Cybersecurity Awareness Month. Join us for various workshops and seminars to enhance your cybersecurity knowledge.',
    author: 'Dr. ',
    date: '2024-10-01'
  },
  {
    id: '2',
    title: 'New Research Lab Opening',
    content: 'We are excited to announce the opening of our new Advanced Cyber Defense Research Lab, equipped with state-of-the-art tools and technologies.',
    author: 'Prof. ',
    date: '2024-09-15'
  }
];

const defaultEvents: Event[] = [
  {
    id: '1',
    title: 'Cybersecurity Conference 2024',
    description: 'Annual cybersecurity conference featuring industry experts and research presentations.',
    date: '2024-11-15',
    type: 'event',
    important: true
  },
  {
    id: '2',
    title: 'Final Exam Schedule Released',
    description: 'Final examination schedule for Fall 2024 semester is now available.',
    date: '2024-10-20',
    type: 'notice',
    important: true
  }
];

const defaultTimetable: Timetable[] = [
  {
    id: '1',
    courseCode: 'FUD-CYB 204',
    courseName: 'Introduction to Cybersecurity',
    day: 'Monday',
    time: '09:00-10:30',
    room: 'Room 101',
    lecturer: 'Prof. Michael Chen'
  },
  {
    id: '2',
    courseCode: 'CSC 202',
    courseName: 'Network Security',
    day: 'Tuesday',
    time: '11:00-12:30',
    room: 'Room 102',
    lecturer: 'Dr. '
  }
];

export const initializeStorage = () => {
  if (!localStorage.getItem('courses')) {
    localStorage.setItem('courses', JSON.stringify(defaultCourses));
  }
  if (!localStorage.getItem('newsletters')) {
    localStorage.setItem('newsletters', JSON.stringify(defaultNewsletters));
  }
  if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify(defaultEvents));
  }
  if (!localStorage.getItem('timetable')) {
    localStorage.setItem('timetable', JSON.stringify(defaultTimetable));
  }
  if (!localStorage.getItem('gallery')) {
    localStorage.setItem('gallery', JSON.stringify([]));
  }
  if (!localStorage.getItem('assignments')) {
    localStorage.setItem('assignments', JSON.stringify([]));
  }
  if (!localStorage.getItem('notes')) {
    localStorage.setItem('notes', JSON.stringify([]));
  }
  if (!localStorage.getItem('attendance')) {
    localStorage.setItem('attendance', JSON.stringify([]));
  }
};

// Generic storage functions
export const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const addToStorage = <T extends { id: string }>(key: string, item: T): T => {
  const items = getFromStorage<T>(key);
  const newItem = { ...item, id: item.id || Date.now().toString() };
  items.push(newItem);
  saveToStorage(key, items);
  return newItem;
};

export const updateInStorage = <T extends { id: string }>(key: string, updatedItem: T): T | null => {
  const items = getFromStorage<T>(key);
  const index = items.findIndex(item => item.id === updatedItem.id);
  if (index !== -1) {
    items[index] = updatedItem;
    saveToStorage(key, items);
    return updatedItem;
  }
  return null;
};

export const deleteFromStorage = <T extends { id: string }>(key: string, id: string): boolean => {
  const items = getFromStorage<T>(key);
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    saveToStorage(key, items);
    return true;
  }
  return false;
};

// Initialize storage on app start
initializeStorage();