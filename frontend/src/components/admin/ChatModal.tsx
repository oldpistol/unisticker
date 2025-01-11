'use client';

import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'admin';
  timestamp: string;
}

export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'admin',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
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
                <h2 className="text-xl font-semibold">Admin Chat Support</h2>
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
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-base">{msg.text}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-6 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-50 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  />
                  <button
                    type="submit"
                    className="bg-[#6366F1] text-white px-8 py-3 rounded-full hover:bg-[#5558E3] flex items-center gap-2"
                  >
                    Send
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
