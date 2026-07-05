import { MessageCircle } from 'lucide-react';

export interface ChatSummary {
  id: string;
  name: string;
  lastMessage?: string;
}

interface ChatSidebarProps {
  connected: boolean;
  chats: ChatSummary[];
  selectedChatId?: string | null;
  onSelect: (chatId: string) => void;
}

const ChatSidebar = ({ connected, chats, selectedChatId, onSelect }: ChatSidebarProps) => {
  return (
    <aside className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Chat</p>
          <h2 className="text-2xl font-semibold text-white">Realtime</h2>
        </div>
        <span
          className={`inline-flex h-3.5 w-3.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-600'}`}
          aria-label={connected ? 'Connected' : 'Disconnected'}
        />
      </div>

      <div className="space-y-3">
        {chats.length === 0 ? (
          <div className="text-sm text-slate-500">No chats yet</div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={`flex w-full items-center gap-3 rounded-3xl border px-4 py-3 text-left transition ${
                selectedChatId === chat.id ? 'border-cyan-500 bg-slate-950' : 'border-slate-800 bg-slate-950/80'
              }`}
            >
              <MessageCircle className="h-5 w-5 text-cyan-400" />
              <div className="flex-1">
                <p className="font-semibold">{chat.name}</p>
                <p className="text-sm text-slate-400 truncate">{chat.lastMessage ?? 'No messages yet'}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
