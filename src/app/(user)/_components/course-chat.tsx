// components/course-chat.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Reply,
  Trash2,
  MessageCircle,
  Loader2,
  CheckCheck,
  RefreshCw,
  Users,
  Sparkles,
} from "lucide-react";
import {
  sendCourseMessage,
  getCourseMessages,
  markMessageAsRead,
  deleteCourseMessage,
  getUnreadNotificationsCount,
} from "@/actions/course-chat";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/scroll";

interface User {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  sender: User;
  replies: Message[];
  reads: { userId: string }[];
}

interface CourseChatProps {
  courseId: string;
  currentUserId: string;
  currentUserRole: string;
}

export function CourseChat({
  courseId,
  currentUserId,
  currentUserRole,
}: CourseChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load messages with optimistic update handling
  const loadMessages = useCallback(
    async (showLoader = false) => {
      if (showLoader) setRefreshing(true);
      try {
        const result = await getCourseMessages(courseId);
        if (result.success && result.messages) {
          setMessages(result.messages as unknown as Message[]);
        } else if (result.error) {
          console.error("Load messages error:", result.error);
        }
      } catch (error) {
        console.error("Load messages error:", error);
      } finally {
        if (showLoader) setRefreshing(false);
      }
    },
    [courseId],
  );

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    try {
      const result = await getUnreadNotificationsCount(courseId);
      if (result.success) {
        setUnreadCount(result.count);
      }
    } catch (error) {
      toast.error("Failed to load unread count");
    }
  }, [courseId]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadMessages(), loadUnreadCount()]);
      setLoading(false);
    };
    init();
  }, [loadMessages, loadUnreadCount]);

  // Setup polling (30 seconds instead of 10 to reduce load)
  useEffect(() => {
    // Clear any existing interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    // Poll every 30 seconds
    pollIntervalRef.current = setInterval(() => {
      loadMessages(false); // Silent refresh
      loadUnreadCount();
    }, 30000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [loadMessages, loadUnreadCount]);

  // Scroll to bottom only when messages change significantly
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // Scroll on initial load
  useEffect(() => {
    if (!loading && messages.length > 0) {
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [loading, scrollToBottom]);

  // Send message with optimistic update
  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage;
    const parentMessageId = replyingTo;

    // Clear input immediately for better UX
    setNewMessage("");
    setReplyingTo(null);
    setSending(true);

    try {
      const result = await sendCourseMessage(
        courseId,
        messageContent,
        parentMessageId || undefined,
      );

      if (result.success && result.message) {
        // Add message optimistically to the UI
        if (!parentMessageId) {
          // Top-level message
          setMessages((prev) => [
            result.message as unknown as Message,
            ...prev,
          ]);
        } else {
          // Reply - update the parent message
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === parentMessageId
                ? {
                    ...msg,
                    replies: [
                      ...msg.replies,
                      result.message as unknown as Message,
                    ],
                  }
                : msg,
            ),
          );
        }

        // Scroll to new message
        setTimeout(() => scrollToBottom(), 100);

        // Background refresh to sync any server changes
        setTimeout(() => {
          loadMessages(false);
          loadUnreadCount();
        }, 1000);
      } else {
        // Restore message on error
        setNewMessage(messageContent);
        setReplyingTo(parentMessageId);
        toast.error("Failed to send message");
      }
    } catch (error) {
      setNewMessage(messageContent);
      setReplyingTo(parentMessageId);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  // Mark as read - debounced
  const handleMarkAsRead = useCallback(
    async (messageId: string) => {
      try {
        const result = await markMessageAsRead(messageId);
        if (result.success && !result.alreadyRead) {
          // Update local state
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === messageId) {
                return {
                  ...msg,
                  reads: [...msg.reads, { userId: currentUserId }],
                };
              }
              if (msg.replies.some((r) => r.id === messageId)) {
                return {
                  ...msg,
                  replies: msg.replies.map((r) =>
                    r.id === messageId
                      ? { ...r, reads: [...r.reads, { userId: currentUserId }] }
                      : r,
                  ),
                };
              }
              return msg;
            }),
          );
          loadUnreadCount();
        }
      } catch (error) {
        console.error("Mark as read error:", error);
      }
    },
    [currentUserId, loadUnreadCount],
  );

  // Delete message with optimistic update
  const handleDelete = async (messageId: string) => {
    try {
      // Optimistically remove from UI
      setMessages((prev) => {
        // Remove if it's a top-level message
        const filtered = prev.filter((msg) => msg.id !== messageId);
        // Or remove from replies
        return filtered.map((msg) => ({
          ...msg,
          replies: msg.replies.filter((r) => r.id !== messageId),
        }));
      });

      const result = await deleteCourseMessage(messageId);

      if (result.success) {
        toast.success("Message deleted");
        // Reload to ensure consistency
        setTimeout(() => loadMessages(false), 500);
      } else {
        // Revert on error
        await loadMessages(false);
        toast.error(result.error || "Failed to delete message");
      }
    } catch (error) {
      await loadMessages(false);
      toast.error("Failed to delete message");
    }
  };

  // Get user initials
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "À l'instant";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "TEACHER":
        return "default";
      case "ADMIN":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "TEACHER":
        return "Instructeur";
      case "ADMIN":
        return "Admin";
      default:
        return null;
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  // Render a single message
  const renderMessage = (message: Message, isReply = false) => {
    const isOwnMessage = message.sender.id === currentUserId;
    const isRead = message.reads.some((r) => r.userId === currentUserId);

    const canDelete =
      isOwnMessage ||
      currentUserRole === "ADMIN" ||
      currentUserRole === "TEACHER";

    const roleLabel = getRoleLabel(message.sender.role);

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`group w-full ${isReply ? "mt-3" : "mt-4"}`}
        onMouseEnter={() => !isRead && handleMarkAsRead(message.id)}
      >
        {/* MAIN MESSAGE CONTAINER — ALWAYS LEFT */}
        <div className="flex gap-3 justify-start">
          {/* AVATAR — LEFT */}
          <Avatar
            className={`h-10 w-10 flex-shrink-0 ring-2 ring-offset-2 ring-offset-background ${
              message.sender.role === "TEACHER"
                ? "ring-primary"
                : message.sender.role === "ADMIN"
                  ? "ring-destructive"
                  : "ring-muted"
            }`}
          >
            <AvatarImage src={message.sender.image || undefined} />
            <AvatarFallback
              className={`text-sm font-semibold ${
                message.sender.role === "TEACHER"
                  ? "bg-purple-500/10 text-purple-700"
                  : "bg-muted"
              }`}
            >
              {getInitials(message.sender.name)}
            </AvatarFallback>
          </Avatar>

          {/* MESSAGE CONTENT */}
          <div className="flex-1 min-w-0">
            <div
              className={`${isReply ? "max-w-[75%]" : "max-w-[85%]"} text-left`}
            >
              {/* REPLY INDICATOR */}
              {isReply && (
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                  <Reply className="h-3 w-3" />
                  <span>Réponse</span>
                  <div className="h-px bg-border flex-1 max-w-[20px]" />
                </div>
              )}

              {/* SENDER INFO */}
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-semibold text-sm text-foreground">
                  {message.sender.name || "Utilisateur"}
                </span>

                {roleLabel && (
                  <Badge
                    variant={getRoleBadgeVariant(message.sender.role)}
                    className="text-xs px-2 py-0"
                  >
                    {roleLabel}
                  </Badge>
                )}

                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(message.createdAt)}
                </span>

                {isOwnMessage && isRead && (
                  <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
                )}
              </div>

              {/* MESSAGE BUBBLE */}
              <div className="inline-block">
                <div
                  className={`rounded-[6px] rounded-bl-md px-4 py-3 shadow-sm ${
                    isReply
                      ? message.sender.role === "TEACHER"
                        ? "bg-gradient-to-br from-primary/15 to-accent/15 border border-purple-600/20"
                        : "bg-muted/80"
                      : message.sender.role === "TEACHER"
                        ? "bg-gradient-to-br from-primary/10 to-accent/10 border border-purple-600/20"
                        : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!isReply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setReplyingTo(message.id);
                        textareaRef.current?.focus();
                      }}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Répondre
                    </Button>
                  )}

                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(message.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REPLIES */}
        {message.replies && message.replies.length > 0 && (
          <div className="relative mt-3 ml-14 space-y-2">
            {/* VERTICAL CONNECTION LINE — LEFT */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border/50 rounded-full" />

            <div className="space-y-2">
              {message.replies.map((reply) => renderMessage(reply, true))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border border-border/50 rounded-[6px] overflow-hidden bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-pubg-purple-600/5 to-accent/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-purple-600/10 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-pubg-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Discussion du cours
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              {messages.length} messages •{" "}
              {messages.reduce((acc, m) => acc + (m.replies?.length || 0), 0)}{" "}
              réponses
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-9 w-9 rounded-[8px]"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-5 py-2">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pubg-purple-600/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-pubg-purple-600/50" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">
              Aucune discussion
            </h4>
            <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
              Soyez le premier à démarrer la conversation avec vos camarades !
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message) => renderMessage(message))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-muted/30">
        <AnimatePresence>
          {replyingTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 mb-3 text-sm bg-purple-600/10 text-pubg-purple-600 px-4 py-2.5 rounded-[8px]"
            >
              <Reply className="h-4 w-4" />
              <span className="font-medium">Réponse au message</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 ml-auto text-pubg-purple-600 hover:text-pubg-purple-600 hover:bg-purple-600/20"
                onClick={() => setReplyingTo(null)}
              >
                Annuler
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          <Textarea
            ref={textareaRef}
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="min-h-[56px] max-h-[120px] resize-none rounded-[8px] border-border/50 bg-background focus-visible:ring-pubg-purple-600/50"
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            size="icon"
            className="h-14 w-14 rounded-[8px] bg-purple-600 hover:bg-purple-600/90 shadow-lg shadow-pubg-purple-600/25 transition-all hover:shadow-xl hover:shadow-pubg-purple-600/30"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Appuyez sur{" "}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
            Entrée
          </kbd>{" "}
          pour envoyer,{" "}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
            Maj+Entrée
          </kbd>{" "}
          pour une nouvelle ligne
        </p>
      </div>
    </div>
  );
}
