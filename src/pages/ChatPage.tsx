import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ChatSidebar from '@/components/sidebar/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import chatService, { ChatSummary, MessagePayload } from '@/services/chatService';
import { toast } from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:5000';

interface SocketMessage extends MessagePayload {
  chatId?: string;
}

const ChatPage = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const socket = useMemo(() => {
    if (!token) return null;
    return io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: false,
    });
  }, [token]);

  // fetch chats
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const res = await chatService.getChats();
        const payloadAny: any = res.data;
        const list: ChatSummary[] = Array.isArray(payloadAny) ? payloadAny : payloadAny?.data ?? payloadAny?.chats ?? [];
        setChats(list);
      } catch (err) {
        console.error('Failed to load chats', err);
      }
    };

    load();
  }, [token]);

  useEffect(() => {
    if (!socket) {
      setConnected(false);
      return;
    }

    socket.connect();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (error) => {
      console.error('Socket connect error:', error);
      setConnected(false);
    });

    socket.on('new_message', (message: SocketMessage) => {
      // if the message is for current chat, append
      if (message.chatId && message.chatId === selectedChatId) {
        setMessages((prev) => [...prev, message]);
      } else {
        // otherwise update lastMessage in chat list
        setChats((prev) =>
          prev.map((c) => (c.id === message.chatId ? { ...c, lastMessage: message.text } : c)),
        );
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('new_message');
      socket.disconnect();
    };
  }, [socket, selectedChatId]);

  const selectChat = async (chatId: string) => {
    if (!token) return;

    // leave previous room
    if (socket && joinedRoom) {
      socket.emit('leave_room', { chatId: joinedRoom });
      setJoinedRoom(null);
    }

    setSelectedChatId(chatId);

    try {
      const res = await chatService.getChatMessages(chatId);
      const payloadAny: any = res.data;
      const msgs: MessagePayload[] = Array.isArray(payloadAny) ? payloadAny : payloadAny?.data ?? payloadAny?.messages ?? [];
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load messages for chat', chatId, err);
      setMessages([]);
    }

    // join new room
    if (socket) {
      socket.emit('join_room', { chatId });
      setJoinedRoom(chatId);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedChatId) {
      toast.error('Please select a chat before sending a message.');
      return;
    }

    // optimistic UI
    const optimistic: MessagePayload = {
      id: `local-${Date.now()}`,
      text,
      user: 'You',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await chatService.postMessage(selectedChatId, { text });
      const payloadAny: any = res.data;
      const saved: MessagePayload = Array.isArray(payloadAny) ? payloadAny[0] : payloadAny?.data ?? payloadAny?.message ?? payloadAny;

      // replace the last local optimistic message with the saved message (if any)
      setMessages((prev) => {
        const idx = [...prev].reverse().findIndex((m) => m.id.startsWith('local-'));
        if (idx === -1) return prev;
        const revIndex = prev.length - 1 - idx;
        const next = [...prev];
        next[revIndex] = saved;
        return next;
      });
    } catch (err) {
      console.error('Failed to post message', err);
    }
  };

  // auto-select first chat when list loads
  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      selectChat(chats[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats]);

  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 bg-slate-950 p-4 text-white xl:grid-cols-[320px_minmax(0,1fr)]">
      <ChatSidebar connected={connected} chats={chats} selectedChatId={selectedChatId} onSelect={selectChat} />
      <ChatWindow messages={messages} connected={connected} canSend={!!selectedChatId} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatPage;
