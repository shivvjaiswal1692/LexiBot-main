import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Scale, User, AlertTriangle } from 'lucide-react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming;

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 mb-5 animate-slide-up">
        <div className="max-w-[75%]">
          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed shadow-sm">
            {message.content}
          </div>
          {message.timestamp && (
            <p className="text-[11px] text-slate-400 text-right mt-1 px-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-4 h-4 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-5 animate-slide-up">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
        <Scale className="w-4 h-4 text-white" />
      </div>
      <div className="max-w-[85%] flex-1">
        <div className="bg-white border border-blue-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
          {message.content ? (
            <div className={cn('message-content text-sm', isStreaming && 'typing-cursor')}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              LexiBot is thinking...
            </div>
          )}
        </div>
        {!isStreaming && message.content && (
          <div className="flex items-center gap-1.5 mt-1.5 px-1">
            <AlertTriangle className="w-3 h-3 text-slate-300 flex-shrink-0" />
            <p className="text-[10px] text-slate-400">
              Legal information only — not legal advice. Consult a licensed attorney.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
