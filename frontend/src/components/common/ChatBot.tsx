import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  'Which team is leading the standings?',
  'What are the upcoming matches?',
  'What were the last match results?',
  'List all teams in the tournament',
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ChatBot: React.FC = () => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "👋 Hi! I'm your Football Championship AI assistant. Ask me anything about the tournament — standings, matches, teams, or players!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
      
      const res = await fetch(`${API_BASE}/api/chat/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ question: text.trim(), history: historyPayload }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.ok ? data.answer : `Error: ${data.detail || 'Something went wrong'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '❌ Could not reach the server. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating button */}
      <button
        id="chatbot-toggle"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none"
        style={{
          background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
          boxShadow: '0 0 24px rgba(6,182,212,0.5)',
        }}
        aria-label="Open AI Chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Notification badge */}
      {!isOpen && (
        <span className="fixed bottom-[72px] right-5 z-50 w-5 h-5 bg-cyan-400 rounded-full border-2 border-white animate-pulse" />
      )}

      {/* Chat popup */}
      {isOpen && (
        <div
          id="chatbot-popup"
          className="fixed bottom-24 right-6 z-50 w-96 flex flex-col rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
          style={{
            height: '560px',
            background: 'rgba(17, 24, 39, 0.97)',
            border: '1px solid rgba(6,182,212,0.3)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(139,92,246,0.2))' }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">AI Football Assistant</p>
              <p className="text-xs text-cyan-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                Powered by Gemini
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 mr-2 flex items-center justify-center mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6c0 3.31 2.69 6 6 6a6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z" />
                    </svg>
                  </div>
                )}
                <div className="max-w-[75%]">
                  <div
                    className={`text-sm px-3 py-2 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'text-white rounded-tr-sm'
                        : 'text-gray-100 rounded-tl-sm'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }
                        : { background: 'rgba(55,65,81,0.8)', border: '1px solid rgba(75,85,99,0.5)' }
                    }
                  >
                    {msg.content}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 px-1">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full flex-shrink-0 mr-2 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
                  <span className="text-white text-xs">AI</span>
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
                  style={{ background: 'rgba(55,65,81,0.8)', border: '1px solid rgba(75,85,99,0.5)' }}>
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions (show only for first interaction) */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-2.5 py-1 rounded-full text-cyan-300 transition-all hover:scale-105"
                  style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)' }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(55,65,81,0.8)' }}>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: 'rgba(55,65,81,0.6)', border: '1px solid rgba(75,85,99,0.6)' }}>
              <input
                ref={inputRef}
                id="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the tournament..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                id="chatbot-send"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs text-gray-600 mt-1.5">Press Enter to send</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
