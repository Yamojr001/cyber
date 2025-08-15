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
    code: 'CS101',
    name: 'Introduction to Cybersecurity',
    description: 'Fundamental concepts of cybersecurity including threats, vulnerabilities, and basic protection mechanisms.',
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
    code: 'CS301',
    name: 'Cryptography and Data Protection',
    description: 'Mathematical foundations of cryptography, encryption algorithms, and data protection strategies.',
    creditHours: 3
  },
  {
    id: '4',
    code: 'CS401',
    name: 'Digital Forensics',
    description: 'Investigation techniques for digital crimes, evidence collection, and forensic analysis tools.',
    creditHours: 4
  },
  {
    id: '5',
    code: 'CS501',
    name: 'Ethical Hacking and Penetration Testing',
    description: 'Hands-on experience with ethical hacking techniques and penetration testing methodologies.',
    creditHours: 3
  }
];

const defaultNewsletters: Newsletter[] = [
  {
    id: '1',
    title: 'Cybersecurity Awareness Month',
    content: 'October is recognized as National Cybersecurity Awareness Month. Join us for various workshops and seminars to enhance your cybersecurity knowledge.',
    author: 'Dr. Sarah Johnson',
    date: '2024-10-01'
  },
  {
    id: '2',
    title: 'New Research Lab Opening',
    content: 'We are excited to announce the opening of our new Advanced Cyber Defense Research Lab, equipped with state-of-the-art tools and technologies.',
    author: 'Prof. Michael Chen',
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
    courseCode: 'CS101',
    courseName: 'Introduction to Cybersecurity',
    day: 'Monday',
    time: '09:00-10:30',
    room: 'Room 101',
    lecturer: 'Prof. Michael Chen'
  },
  {
    id: '2',
    courseCode: 'CS201',
    courseName: 'Network Security',
    day: 'Tuesday',
    time: '11:00-12:30',
    room: 'Room 102',
    lecturer: 'Dr. Sarah Johnson'
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