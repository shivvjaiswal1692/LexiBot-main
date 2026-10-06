import { useEffect, useState } from 'react';
import { Scale, Plus, Trash2, MessageSquare, ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';
import { ChatSession, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { formatRelativeTime, cn } from '@/lib/utils';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onLoadSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onBack: () => void;
  onFetchHistory: () => void;
}

export function Sidebar({ sessions, currentSessionId, onNewChat, onLoadSession, onDeleteSession, onBack, onFetchHistory }: SidebarProps) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { onFetchHistory(); }, [onFetchHistory]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    await onDeleteSession(id);
    setDeletingId(null);
  };

  return (
    <aside className={cn(
      'flex flex-col h-full bg-white border-r border-blue-100 transition-all duration-300 flex-shrink-0 shadow-sm',
      collapsed ? 'w-16' : 'w-72'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-100">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-blue-950 text-lg">LexiBot</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center mx-auto">
            <Scale className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn('text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-blue-50', collapsed && 'mt-2 mx-auto')}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all duration-200 shadow-sm',
            collapsed && 'justify-center px-2'
          )}
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          {!collapsed && 'New Conversation'}
        </button>
      </div>

      {/* Sessions */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {sessions.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-xs">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-2">Recent Chats</p>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onLoadSession(session.id)}
                  className={cn(
                    'group flex items-start gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150',
                    currentSessionId === session.id
                      ? 'bg-blue-50 border border-blue-200 text-blue-700'
                      : 'hover:bg-slate-50 text-slate-600'
                  )}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate leading-tight">{session.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('legal-badge text-[10px] px-1.5 py-0.5', CATEGORY_COLORS[session.category])}>
                        {CATEGORY_LABELS[session.category]}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatRelativeTime(session.updatedAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all flex-shrink-0 p-0.5"
                    disabled={deletingId === session.id}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className={cn('border-t border-blue-100 p-3 space-y-1', collapsed && 'flex flex-col items-center gap-1')}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-50 mb-1">
            <div className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-blue-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-blue-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={onBack}
          className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 text-sm transition-all font-medium', collapsed && 'justify-center')}
        >
          <ChevronLeft className="w-4 h-4 flex-shrink-0" />
          {!collapsed && 'Back to Home'}
        </button>
        <button
          onClick={logout}
          className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 text-sm transition-all font-medium', collapsed && 'justify-center')}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
