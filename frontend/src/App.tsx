import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/hooks/useChat';
import { LandingPage } from '@/components/LandingPage';
import { AuthPage } from '@/components/AuthPage';
import { Sidebar } from '@/components/Sidebar';
import { ChatWindow } from '@/components/ChatWindow';
import { HowItWorks } from '@/components/HowItWorks';
import { Scale } from 'lucide-react';

type View = 'landing' | 'auth' | 'chat';

export default function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const chat = useChat();
  useEffect(() => {
  if (isAuthenticated && view === 'auth') {
    setView('chat');
  }
}, [isAuthenticated, view]);

  const handleStartChat = () => {
    if (isAuthenticated) {
      setView('chat');
    } else {
      setView('auth');
    }
  };

  const handleBackToHome = () => {
    setView('landing');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center font-body">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-slow">
            <Scale className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading LexiBot...</p>
        </div>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <>
        <LandingPage onStartChat={handleStartChat} onHowItWorks={() => setShowHowItWorks(true)} />
        <HowItWorks open={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      </>
    );
  }

  if (view === 'auth') {
    return <AuthPage onBack={handleBackToHome} />;
  }

  if (!isAuthenticated) {
    setView('auth');
    return null;
  }

  return (
    <>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-body">
        <Sidebar
          sessions={chat.sessions}
          currentSessionId={chat.currentSessionId}
          onNewChat={chat.startNewChat}
          onLoadSession={chat.loadSession}
          onDeleteSession={chat.deleteSession}
          onBack={handleBackToHome}
          onFetchHistory={chat.fetchHistory}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatWindow
            messages={chat.messages}
            isStreaming={chat.isStreaming}
            isLoading={chat.isLoading}
            error={chat.error}
            onSend={chat.sendMessage}
            onStop={chat.stopStreaming}
            onClearError={() => {}}
          />
        </main>
      </div>
      <HowItWorks open={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </>
  );
}
