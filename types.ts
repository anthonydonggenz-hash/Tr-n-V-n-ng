
export interface Student {
  name: string;
  avatar: string;
  question: string;
}

export interface HistoryEntry {
  student: Student;
  index: number; // The index in the array from which it was removed
}
