import { useState, useRef, useCallback } from 'react';
import { Message, ChatSession } from '@/types';
import api from '@/lib/api';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get('/chat/history');
      setSessions(res.data.sessions);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, []);

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/chat/session/${sessionId}`);
      const session = res.data.session;
      setMessages(session.messages.filter((m: Message) => m.role !== 'system'));
      setCurrentSessionId(sessionId);
    } catch {
      setError('Failed to load conversation.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: Message = { role: 'user', content, timestamp: new Date().toISOString() };
    const streamingMessage: Message = { role: 'assistant', content: '', isStreaming: true };

    setMessages((prev) => [...prev, userMessage, streamingMessage]);
    setIsStreaming(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem('lexibot_token');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: content, ...(currentSessionId && { sessionId: currentSessionId }) }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Request failed');
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let newSessionId = currentSessionId;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'session') {
              newSessionId = data.sessionId;
              setCurrentSessionId(data.sessionId);
            } else if (data.type === 'chunk') {
              accumulatedContent += data.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: accumulatedContent, isStreaming: true };
                return updated;
              });
            } else if (data.type === 'done') {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: accumulatedContent, isStreaming: false };
                return updated;
              });
              setCurrentSessionId(newSessionId);
              // Refresh history in background
              fetchHistory();
            } else if (data.type === 'error') {
              throw new Error(data.message);
            }
          } catch (parseErr) {
            // Skip malformed SSE lines
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
      setMessages((prev) => prev.slice(0, -1)); // Remove streaming message
    } finally {
      setIsStreaming(false);
    }
  }, [currentSessionId, isStreaming, fetchHistory]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setError(null);
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await api.delete(`/chat/session/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (currentSessionId === sessionId) startNewChat();
    } catch {
      setError('Failed to delete conversation.');
    }
  }, [currentSessionId, startNewChat]);

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setMessages((prev) => {
      const updated = [...prev];
      if (updated[updated.length - 1]?.isStreaming) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], isStreaming: false };
      }
      return updated;
    });
  }, []);

  return {
    messages, sessions, currentSessionId, isLoading, isStreaming, error,
    sendMessage, startNewChat, loadSession, fetchHistory, deleteSession, stopStreaming,
  };
}
