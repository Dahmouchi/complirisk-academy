import { useState, useRef, useEffect } from "react";
import { useDataChannel, useLocalParticipant } from "@livekit/components-react";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: number;
  isTeacher?: boolean;
}

interface ChatPanelProps {
  isTeacher: boolean;
}

export const ChatPanel = ({ isTeacher }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { localParticipant } = useLocalParticipant();

  const { send, message } = useDataChannel("chat");

  // Handle incoming messages
  useEffect(() => {
    if (message) {
      try {
        const parsed = JSON.parse(new TextDecoder().decode(message.payload));
        // Avoid duplicates
        setMessages(prev => {
          const exists = prev.some(m => m.timestamp === parsed.timestamp && m.sender === parsed.sender);
          if (exists) return prev;
          return [...prev, {
            id: `${Date.now()}-${Math.random()}`,
            sender: parsed.sender,
            message: parsed.message,
            timestamp: parsed.timestamp,
            isTeacher: parsed.isTeacher,
          }];
        });
      } catch (error) {
        console.error('Failed to parse chat message:', error);
      }
    }
  }, [message]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !send) return;

    const messageData = {
      sender: localParticipant.name || 'Anonymous',
      message: newMessage.trim(),
      timestamp: Date.now(),
      isTeacher,
    };

    const encoder = new TextEncoder();
    send(encoder.encode(JSON.stringify(messageData)), { reliable: true });

    setMessages(prev => [...prev, {
      id: `${Date.now()}-local`,
      ...messageData,
    }]);

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Chat</h3>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === localParticipant.name ? 'items-end' : 'items-start'
                }`}
              >
                <span className="text-xs font-medium text-muted-foreground mb-1">
                  {msg.sender}{msg.isTeacher && ' (Teacher)'}
                </span>
                <div
                  className={`rounded-lg px-3 py-2 max-w-[85%] ${
                    msg.sender === localParticipant.name
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button size="icon" onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
