'use client';

import { useState, useRef, useEffect } from 'react';
import { useCollaboration } from '@/contexts/collaboration-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Mic } from 'lucide-react';
import { formatTimestamp } from '@/lib/collaboration/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import VoiceNoteRecorder from './voice-note-recorder';
import VoiceNotePlayer from './voice-note-player';

export default function CollaborationChat() {
  const { state, sendMessage, sendVoiceNote } = useCollaboration();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSendMessage = () => {
    if (message.trim() && state.session) {
      sendMessage(message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!state.session) {
    return null;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="space-y-3 py-4">
            {state.messages.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              state.messages.map((msg) => {
                const user = state.users.get(msg.userId);
                const isCurrentUser = msg.userId === state.currentUser?.id;
                
                // Debug: Log voice note messages
                if (msg.type === 'voice') {
                  console.log('Voice note message:', {
                    id: msg.id,
                    type: msg.type,
                    hasAudioUrl: !!msg.audioUrl,
                    audioUrlLength: msg.audioUrl?.length || 0,
                    duration: msg.audioDuration,
                  });
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className="text-xs"
                        style={{
                          backgroundColor: user?.color || '#666',
                          color: 'white',
                        }}
                      >
                        {user?.name.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{msg.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(msg.timestamp)}
                        </span>
                      </div>
                      {msg.type === 'voice' ? (
                        msg.audioUrl ? (
                          <VoiceNotePlayer
                            audioUrl={msg.audioUrl}
                            duration={msg.audioDuration || 0}
                            userName={msg.userName}
                            isCurrentUser={isCurrentUser}
                          />
                        ) : (
                          <div
                            className={`text-sm rounded-lg px-3 py-2 ${
                              isCurrentUser
                                ? 'bg-primary text-primary-foreground ml-auto'
                                : 'bg-muted'
                            }`}
                            style={{ maxWidth: '80%', display: 'inline-block' }}
                          >
                            <Mic className="h-4 w-4 inline mr-2" />
                            Voice note (loading...)
                          </div>
                        )
                      ) : (
                        <div
                          className={`text-sm rounded-lg px-3 py-2 ${
                            isCurrentUser
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : 'bg-muted'
                          }`}
                          style={{ maxWidth: '80%', display: 'inline-block' }}
                        >
                          {msg.message}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="p-4 border-t space-y-2">
          <VoiceNoteRecorder
            onRecordComplete={sendVoiceNote}
            disabled={!state.isConnected}
          />
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!state.isConnected}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || !state.isConnected}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
