export interface Subject {
  id: number;
  name: string;
  code: string;
  semester: number[];
}

export const subjects: Subject[] = [
  // Semester 1
  { id: 1, name: 'Introduction to Problem solving', code: 'CST-101', semester: [1] },
  { id: 2, name: 'Mathematics - 1', code: 'CST-102', semester: [1] },
  { id: 3, name: 'Semiconductor Physics', code: 'CST-103', semester: [1] },
  { id: 4, name: 'Biology for Engineers', code: 'CST-104', semester: [1] },

  // Semester 2
  { id: 5, name: 'Elementary Data Structures in C++', code: 'CST-201', semester: [2] },
  { id: 6, name: 'Introduction to Electrical and Electronics Engineering', code: 'CST-202', semester: [2] },
  { id: 7, name: 'Mathematics-2', code: 'CST-203', semester: [2] },
  { id: 8, name: 'Engineering Physics', code: 'CST-204', semester: [2] },

  // Semester 3
  { id: 9, name: 'Discrete Mathematics', code: 'CST-301', semester: [3] },
  { id: 10, name: 'Advanced Data Structures and Algorithms', code: 'CST-302', semester: [3] },
  { id: 11, name: 'Introduction to Microcontrollers and Embedded Systems', code: 'CST-303', semester: [3] },

  // Semester 4
  { id: 12, name: 'Object Oriented Programming using Java', code: 'CST-401', semester: [4] },
  { id: 13, name: 'Computer Organization and Architecture', code: 'CST-402', semester: [4] },
  { id: 14, name: 'Software Engineering', code: 'CST-403', semester: [4] },
  { id: 15, name: 'DBMS', code: 'CST-404', semester: [4] },
  { id: 16, name: 'Probability and Statistics', code: 'CST-405', semester: [4] },

  // Semester 5
  { id: 17, name: 'Database Management Systems', code: 'CST-501', semester: [5] },
  { id: 18, name: 'Computer Networks', code: 'CST-502', semester: [5] },
  { id: 19, name: 'Operating Systems', code: 'CST-503', semester: [5] },
  { id: 20, name: 'ADBMS', code: 'CST-504', semester: [5] },
  { id: 21, name: 'Design And Analysis Of Algorithms', code: 'CST-505', semester: [5] },
  { id: 22, name: 'Competitive Coding-1', code: 'CST-506', semester: [5] },
  { id: 23, name: 'Project Based Learning in Java', code: 'CST-507', semester: [5] },
  { id: 24, name: 'Full Stack-1', code: 'CST-508', semester: [5] },

  // Semester 6
  { id: 25, name: 'Web Development', code: 'CST-601', semester: [6] },
  { id: 26, name: 'Machine Learning', code: 'CST-602', semester: [6] },
  { id: 27, name: 'Software Testing', code: 'CST-603', semester: [6] },
  { id: 28, name: 'Mobile Application Development', code: 'CST-604', semester: [6] },

  // Semester 7
  { id: 29, name: 'Artificial Intelligence', code: 'CST-701', semester: [7] },
  { id: 30, name: 'Cloud Computing', code: 'CST-702', semester: [7] },
  { id: 31, name: 'Cyber Security', code: 'CST-703', semester: [7] },
  { id: 32, name: 'Data Science', code: 'CST-704', semester: [7] },

  // Semester 8
  { id: 33, name: 'Final Year Project', code: 'CST-801', semester: [8] },
  { id: 34, name: 'Industrial Training', code: 'CST-802', semester: [8] },
  { id: 35, name: 'Seminar', code: 'CST-803', semester: [8] },
];
