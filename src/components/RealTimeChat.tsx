'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Flag } from 'lucide-react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface RealTimeChatProps {
  currentUserId: string;
  currentUserName: string;
  initialMessages?: ChatMessage[];
  onSendMessage?: (content: string) => void;
  /** Simulate typing indicator from other users */
  typingUsers?: string[];
  onReportMessage?: (messageId: string) => void;
  className?: string;
}

export function RealTimeChat({
  currentUserId,
  currentUserName,
  initialMessages = [],
  onSendMessage,
  typingUsers = [],
  onReportMessage,
  className = '',
}: RealTimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleSend = () => {
    const content = input.trim();
    if (!content) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    onSendMessage?.(content);
    setInput('');
    setIsTyping(false);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (!isTyping && value) {
      setIsTyping(true);
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => setIsTyping(false), 1500);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Group consecutive messages from the same sender
  const grouped = messages.reduce<Array<ChatMessage & { showHeader: boolean }>>(
    (acc, msg, i) => {
      const prev = messages[i - 1];
      acc.push({ ...msg, showHeader: !prev || prev.senderId !== msg.senderId });
      return acc;
    },
    [],
  );

  return (
    <div
      className={`flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">Chat</h2>
      </div>

      {/* Messages */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
        style={{ minHeight: 240, maxHeight: 400 }}
      >
        {grouped.length === 0 && (
          <p className="m-auto text-sm text-gray-400 dark:text-gray-500">
            No messages yet. Say hello!
          </p>
        )}

        {grouped.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} ${msg.showHeader ? 'mt-3' : 'mt-0.5'}`}
            >
              {msg.showHeader && (
                <span className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                  {isOwn ? 'You' : msg.senderName}
                </span>
              )}
                  <div className="group flex items-end gap-1.5">
                    {!isOwn && (
                      <button
                        type="button"
                        onClick={() => onReportMessage?.(msg.id)}
                        className="mb-1 hidden text-gray-400 hover:text-red-500 group-hover:block dark:text-gray-500"
                        title="Report message"
                      >
                        <Flag className="h-3 w-3" />
                      </button>
                    )}
                    <div
                      className={`max-w-xs rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        isOwn
                          ? 'rounded-br-sm bg-blue-600 text-white'
                          : 'rounded-bl-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2 dark:bg-gray-800">
              <span className="animate-bounce text-gray-400 dark:text-gray-500" style={{ animationDelay: '0ms' }}>•</span>
              <span className="animate-bounce text-gray-400 dark:text-gray-500" style={{ animationDelay: '150ms' }}>•</span>
              <span className="animate-bounce text-gray-400 dark:text-gray-500" style={{ animationDelay: '300ms' }}>•</span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-gray-200 p-3 dark:border-gray-700">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          aria-label="Message input"
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
