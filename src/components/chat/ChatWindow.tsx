import { MessageSquare, Send } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ChatWindowProps {
  messages: Array<{ id: string; text: string; user: string; createdAt: string }>;
  connected: boolean;
  canSend?: boolean;
  onSendMessage: (text: string) => void;
}

const ChatWindow = ({ messages, connected, canSend, onSendMessage }: ChatWindowProps) => {
  const [text, setText] = useState('');
  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [messages],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    onSendMessage(text.trim());
    setText('');
  };

  return (
    <section className="flex min-h-[calc(100vh-2rem)] flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Live chat</h1>
          <p className="text-sm text-slate-400">Stay connected with websocket events.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${connected ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700/60 text-slate-400'}`}>
          {connected ? 'Online' : 'Offline'}
        </span>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 p-4">
        {sortedMessages.length === 0 ? (
          <div className="grid h-64 place-items-center text-center text-slate-500">
            <div>
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
              <p className="text-sm">No messages yet. Connect to the backend and watch them appear.</p>
            </div>
          </div>
        ) : (
          sortedMessages.map((message) => (
            <article key={message.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{message.user}</p>
                <time className="text-xs text-slate-500">{new Date(message.createdAt).toLocaleTimeString()}</time>
              </div>
              <p className="mt-2 text-slate-300">{message.text}</p>
            </article>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-950 p-3">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={canSend ? 'Type your message...' : 'Select a chat to send messages...'}
          className="flex-1 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500"
          disabled={!connected}
        />
        <button
          type="submit"
          disabled={!connected || !text.trim()}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </section>
  );
};

export default ChatWindow;
