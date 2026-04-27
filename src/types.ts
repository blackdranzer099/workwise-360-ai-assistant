export interface UserProfile {
  name: string;
  avatarUrl?: string;
  role: string;
}

export interface KpiCards {
  notifications?: number;
  attendance?: string;
  support?: number;
  timesheet?: string;
  projects?: number;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  cards?: KpiCards;
}

export interface ChatRequest {
  employeeId: string;
  question: string;
}

export interface ChatResponse {
  reply: string;
  cards?: KpiCards;
}
