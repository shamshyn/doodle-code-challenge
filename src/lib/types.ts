export interface Message {
  id: string;
  message: string;
  author: string;
  timestamp: string;
}

export interface ApiMessage {
  id?: string;
  message: string;
  author: string;
  timestamp?: string;
  createdAt?: string;
}

export interface GetMessagesResponse {
  messages: Message[];
  nextCursor?: string;
  previousCursor?: string;
}

export interface PostMessageRequest {
  message: string;
  author: string;
}

export interface PostMessageResponse {
  message: Message;
}
