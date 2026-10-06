import { useEffect, useRef } from 'react';
import { Scale, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Message } from '@/types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { cn } from '@/lib/utils';

const TOPIC_STARTERS = [
  { emoji: '⚖️', label: 'Criminal Defense',  prompt: "What are my rights if I'm charged with a crime?" },
  { emoji: '📋', label: 'Contract Issues',    prompt: 'What makes a contract legally binding?' },
  { emoji: '🏢', label: 'Business Setup',     prompt: "What's the best legal structure for my startup?" },
  { emoji: '👨‍👩‍👧', label: 'Family Matters', prompt: 'How is child custody determined in a divorce?' },
  { emoji: '🏠', label: 'Tenant Rights',      prompt: 'What are my rights as a tenant if facing eviction?' },
  { emoji: '💼', label: 'Employment Law',     prompt: 'What constitutes workplace discrimination?' },
];

interface ChatWindowProps {
  messages: Message[];
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
  onSend: (msg: string) => void;
  onStop: () => void;
  onClearError: () => void;
}

export function ChatWindow({ messages, isStreaming, isLoading, error, onSend, onStop, onClearError }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-100 bg-white shadow-sm">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <Scale className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-blue-950 text-sm">LexiBot Legal Assistant</h2>
          <div className="flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full', isStreaming ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400')} />
            <span className="text-[11px] text-slate-400 font-medium">{isStreaming ? 'Generating response...' : 'Online · Powered by Hugging Face'}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {isLoading ? (
          <div className="flex flex-col gap-4 animate-fade-in">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn('flex gap-3', i % 2 === 0 && 'justify-end')}>
                {i % 2 !== 0 && <div className="w-8 h-8 rounded-full shimmer" />}
                <div className={cn('rounded-2xl shimmer', i % 2 === 0 ? 'w-48 h-12' : 'w-72 h-16')} />
                {i % 2 === 0 && <div className="w-8 h-8 rounded-full shimmer" />}
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <WelcomeScreen onSend={onSend} />
        ) : (
          messages.map((msg, i) => <MessageBubble key={i} message={msg} />)
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 animate-slide-up">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 flex-1">{error}</p>
            <button onClick={onClearError} className="text-red-400 hover:text-red-500 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-3 bg-white border-t border-blue-100">
        <ChatInput onSend={onSend} onStop={onStop} isStreaming={isStreaming} disabled={isLoading} />
      </div>
    </div>
  );
}

function WelcomeScreen({ onSend }: { onSend: (msg: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-8 animate-fade-in">
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
        <Scale className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-blue-950 mb-2">Ask LexiBot</h1>
      <p className="text-slate-500 text-sm mb-8 max-w-sm text-center leading-relaxed">
        Get instant legal guidance on any topic. Choose a category below or type your question directly.
      </p>

      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Start Topics</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {TOPIC_STARTERS.map((topic) => (
            <button
              key={topic.label}
              onClick={() => onSend(topic.prompt)}
              className="group flex items-center gap-3 p-4 card hover:border-blue-200 hover:shadow-md rounded-2xl transition-all duration-200 text-left hover:-translate-y-0.5"
            >
              <span className="text-xl">{topic.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-blue-900 group-hover:text-blue-600 transition-colors">{topic.label}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{topic.prompt}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
