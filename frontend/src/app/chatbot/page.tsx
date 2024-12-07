'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { menuItems } from '@/config/navigation';
import { getActiveMenuItems } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import withAuth from '@/middleware/withAuth';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  client_id?: string;
}

const ChatBot = () => {
  const pathname = usePathname();
  const activeMenuItems = getActiveMenuItems(pathname);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState<string>('');
  const ws = useRef<WebSocket | null>(null);
  const clientId = useRef<string>(Math.random().toString(36).substring(7));

  // WebSocket URL - adjust this based on your environment
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8080';

  // WebSocket connection
  useEffect(() => {
    if (!mounted) return;

    const connectWebSocket = () => {
      try {
        setWsError('');
        ws.current = new WebSocket(`${WS_URL}/ws/${clientId.current}`);

        ws.current.onopen = () => {
          setWsConnected(true);
          setWsError('');
          console.log('Connected to chat service');
        };

        ws.current.onclose = () => {
          setWsConnected(false);
          setWsError('Connection closed. Attempting to reconnect...');
          // Try to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        ws.current.onerror = (error) => {
          setWsError('Failed to connect to chat service. Please ensure the service is running.');
          console.error('WebSocket error:', error);
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'disconnect') {
            setMessages(prev => [...prev, {
              id: prev.length + 1,
              text: `User ${data.client_id} ${data.message}`,
              isUser: false,
              timestamp: new Date().toLocaleTimeString(),
              client_id: data.client_id
            }]);
          } else {
            setMessages(prev => [...prev, {
              id: prev.length + 1,
              text: data.message,
              isUser: data.client_id === clientId.current,
              timestamp: new Date().toLocaleTimeString(),
              client_id: data.client_id
            }]);
          }
        };
      } catch (error) {
        setWsError('Failed to establish WebSocket connection');
        console.error('WebSocket connection error:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [mounted]);

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
    if (!inputText.trim() || isLoading || !wsConnected) return;

    const message = {
      message: inputText.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      setInputText('');
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Chat Assistant</h2>
                  <p className="text-sm text-gray-500">Ask me anything about your application</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm text-gray-500">{wsConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
              {wsError && (
                <div className="mt-2 text-sm text-red-500">
                  {wsError}
                </div>
              )}
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
                    {message.client_id && !message.isUser && (
                      <p className="text-xs text-gray-500 mb-1">User: {message.client_id}</p>
                    )}
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
                  disabled={isLoading || !inputText.trim() || !wsConnected}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <></>
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
};

export default withAuth(ChatBot);
