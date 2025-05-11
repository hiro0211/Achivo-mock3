export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai" | "error";
  timestamp: Date;
  userId: string;
}

export interface DifyInput {
  user_name: string;
  ideal_future: string;
}
