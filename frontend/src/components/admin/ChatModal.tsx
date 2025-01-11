'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'admin' | 'assistant';
  timestamp: string;
  userId?: string;
}

export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const adminId = useRef<string>(Math.random().toString(36).substring(7));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatApplicationsTable = (data: any) => {
    if (!Array.isArray(data)) return data;
    
    // Create table header
    let table = '| ID | User Name | Vehicle Plate | Application Date | Status | Expiry Date | Remarks |\n';
    table += '|:---:|:---:|:---:|:---:|:---:|:---:|:---:|\n';
    
    // Add rows
    data.forEach(app => {
      const appDate = app.application_date ? app.application_date.split('T')[0] : '-';
      const expDate = app.expiry_date ? app.expiry_date.split('T')[0] : '-';
      
      table += `| ${app.id} | ${app.user_name} | ${app.vehicle_plate_no} | ${appDate} | ${app.status} | ${expDate} | ${app.remarks || '-'} |\n`;
    });
    
    return table;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isOpen) return;

    const connectWebSocket = () => {
      ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8080'}/ws/admin/${adminId.current}`);

      ws.current.onopen = () => {
        setWsConnected(true);
        console.log('Connected to admin chat service');
      };

      ws.current.onclose = () => {
        setWsConnected(false);
        setTimeout(connectWebSocket, 3000);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);
        
        if (data.type === 'message') {
          // Don't add admin messages received from server to avoid duplicates
          if (data.sender !== 'admin') {
            let messageText = data.content || data.message; // Handle both content and message keys
            
            // If the message contains application data, format it as a table
            if (Array.isArray(messageText)) {
              messageText = formatApplicationsTable(messageText);
            }
            
            // Skip empty messages
            if (!messageText?.trim()) {
              return;
            }

            const newMessage: Message = {
              id: data.id || Date.now(),
              text: messageText,
              sender: data.client_id === 'ai' || data.client_id === 'assistant' ? 'assistant' : 'user',
              timestamp: new Date().toLocaleTimeString(),
              userId: data.userId
            };

            setMessages(prev => {
              // Check if message with same ID already exists
              if (!prev.some(msg => msg.id === newMessage.id)) {
                return [...prev, newMessage];
              }
              return prev;
            });
            
            // Reset streaming state only if this is a non-streaming message
            if (!data.isStreaming) {
              setIsStreaming(false);
              setStreamingMessage('');
            }
          }
        } else if (data.type === 'stream') {
          setIsStreaming(true);
          const chunk = data.chunk || data.token || '';
          if (data.isStart || !streamingMessage) {
            setStreamingMessage(chunk);
          } else {
            setStreamingMessage(prev => prev + chunk);
          }
        } else if (data.type === 'stream_end') {
          setIsStreaming(false);
          const finalChunk = data.chunk || data.token || '';
          const completeMessage = streamingMessage + finalChunk;
          
          if (completeMessage.trim()) {
            const newMessage: Message = {
              id: data.id || Date.now(),
              text: completeMessage,
              sender: 'assistant',
              timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, newMessage]);
          }
          setStreamingMessage('');
        }
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'admin',
      timestamp: new Date().toLocaleTimeString()
    };

    // Add message to local state immediately
    setMessages(prev => [...prev, newMessage]);

    // Send message to server
    const messageData = {
      type: 'message',
      content: message,
      sender: 'admin',
      timestamp: new Date().toISOString()
    };

    ws.current.send(JSON.stringify(messageData));
    setMessage('');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-4xl h-[800px] rounded-xl shadow-xl flex flex-col">
              {/* Header */}
              <div className="p-5 flex items-center justify-between bg-[#6366F1] text-white rounded-t-xl">
                <div>
                  <h2 className="text-xl font-semibold">Admin Chat Support</h2>
                  <p className="text-sm opacity-80">{wsConnected ? 'Connected' : 'Disconnected'}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'admin' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-6 py-3 ${
                        msg.sender === 'admin'
                          ? 'bg-[#6366F1] text-white'
                          : msg.sender === 'assistant'
                          ? 'bg-[#E7FFE7] text-gray-900'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-current opacity-90">
                          {msg.sender === 'admin' ? 'Admin' : 
                           msg.sender === 'assistant' ? 'AI Assistant' : 
                           'User'}
                        </span>
                        {msg.userId && (
                          <span className="text-xs opacity-75 text-current">
                            ({msg.userId})
                          </span>
                        )}
                      </div>
                      <div className="text-base text-current prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-1 prose-ul:my-1 prose-ol:my-1
                        prose-table:my-2 prose-table:border-collapse prose-table:w-full
                        prose-thead:bg-gray-100 prose-thead:text-left
                        prose-th:p-2 prose-th:border prose-th:border-gray-300
                        prose-td:p-2 prose-td:border prose-td:border-gray-300">
                        {msg.sender === 'assistant' ? (
                          <ReactMarkdown>
                            {msg.text}
                          </ReactMarkdown>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                      </div>
                      <span className="text-xs opacity-75 mt-1 block text-current">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                {isStreaming && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl px-6 py-3 bg-[#E7FFE7] text-gray-900">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-current opacity-90">
                          AI Assistant
                        </span>
                      </div>
                      <div className="text-base text-current prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-1 prose-ul:my-1 prose-ol:my-1
                        prose-table:my-2 prose-table:border-collapse prose-table:w-full
                        prose-thead:bg-gray-100 prose-thead:text-left
                        prose-th:p-2 prose-th:border prose-th:border-gray-300
                        prose-td:p-2 prose-td:border prose-td:border-gray-300">
                        <ReactMarkdown>
                          {streamingMessage}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-50 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] text-gray-900"
                  />
                  <button
                    type="submit"
                    disabled={!wsConnected}
                    className="bg-[#6366F1] text-white px-8 py-3 rounded-full hover:bg-[#5558E3] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Send</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
