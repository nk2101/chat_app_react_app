import api from './api';

export interface ChatSummary {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt?: string;
}

export interface MessagePayload {
  id: string;
  text: string;
  user: string;
  createdAt: string;
}

export const getChats = () => api.get<ChatSummary[]>('/chats');

export const getChatMessages = (chatId: string) => api.get<MessagePayload[]>(`/chats/${chatId}/messages`);

export const postMessage = (chatId: string, body: { text: string }) => api.post<MessagePayload>(`/chats/${chatId}/messages`, body);

export default {
  getChats,
  getChatMessages,
  postMessage,
};
