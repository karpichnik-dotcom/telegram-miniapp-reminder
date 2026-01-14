export interface Reminder {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // ISO string
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
}
