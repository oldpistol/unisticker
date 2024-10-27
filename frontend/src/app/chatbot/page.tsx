'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { menuItems } from '@/config/navigation';
import { getActiveMenuItems } from '@/utils/navigation';
import { usePathname } from 'next/navigation';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}

export default function ChatBot() {
  const pathname = usePathname();
  const activeMenuItems = getActiveMenuItems(pathname);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Initial greeting message
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      const initialMessage: ChatMessage = {
        id: 1,
        text: "Hello! 👋 How can I help you today?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        status: 'sent'
      };
      setMessages([initialMessage]);
    }
  }, [mounted]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate API call delay
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botResponse: ChatMessage = {
        id: messages.length + 2,
        text: "Thank you for your message. I understand you're asking about this. Let me help you with that.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        status: 'sent'
      };

      setMessages(prev => [
        ...prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
        ),
        botResponse
      ]);
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <MenuBar items={activeMenuItems} />
      
      <div className="w-full">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-14rem)] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Chat Assistant</h2>
              <p className="text-sm text-gray-500">Ask me anything about your application</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className={`text-xs ${message.isUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </span>
                      {message.isUser && message.status && (
                        <span className="text-xs">
                          {message.status === 'sending' && '⏳'}
                          {message.status === 'sent' && '✓'}
                          {message.status === 'error' && '⚠️'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
