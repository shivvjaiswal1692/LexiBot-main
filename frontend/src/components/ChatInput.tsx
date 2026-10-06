import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Square, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "What are my rights if I'm arrested?",
  "How do I form an LLC?",
  "What is a non-disclosure agreement?",
  "How does child custody work?",
  "What can I do if my landlord won't return my deposit?",
  "What constitutes wrongful termination?",
];

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setInput('');
    setShowSuggestions(false);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'; }
  };

  return (
    <div className="relative">
      {/* Suggestions */}
      {showSuggestions && (
        <div className="absolute bottom-full mb-2 left-0 right-0 card shadow-lg rounded-2xl p-3 z-10 animate-slide-up border-blue-200">
          <p className="text-xs font-semibold text-slate-400 mb-2 px-1 uppercase tracking-wider">Suggested questions</p>
          <div className="space-y-0.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); setShowSuggestions(false); textareaRef.current?.focus(); }}
                className="w-full text-left text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all duration-150"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className={cn(
        'flex items-end gap-3 bg-white border-2 rounded-2xl px-4 py-3 transition-all duration-200 shadow-sm',
        disabled ? 'border-slate-200 opacity-60' : 'border-blue-200 focus-within:border-blue-400 focus-within:shadow-md'
      )}>
        <button
          type="button"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className={cn(
            'flex-shrink-0 mb-0.5 p-1.5 rounded-lg transition-all duration-150',
            showSuggestions ? 'text-blue-600 bg-blue-100' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'
          )}
          title="Suggested questions"
        >
          <Lightbulb className="w-4 h-4" />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask a legal question... (Shift+Enter for new line)"
          rows={1}
          maxLength={2000}
          className="flex-1 bg-transparent text-slate-700 placeholder-slate-400 text-sm resize-none outline-none leading-relaxed min-h-[24px] max-h-[160px] py-0.5"
        />

        {isStreaming ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 w-9 h-9 bg-red-100 hover:bg-red-200 border border-red-200 text-red-500 rounded-xl flex items-center justify-center transition-all duration-150 mb-0.5"
            title="Stop generating"
          >
            <Square className="w-4 h-4" fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className={cn(
              'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 mb-0.5',
              input.trim() && !disabled
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:-translate-y-0.5'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            )}
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mt-1">
        <div></div>
        <p className="text-xs text-slate-400">{input.length}/2000</p>
      </div>

      <p className="text-center text-[10px] text-slate-400 mt-2">
        LexiBot may make mistakes. Always verify with a licensed attorney.
      </p>
    </div>
  );
}
