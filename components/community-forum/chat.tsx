"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import {
  Smile,
  Paperclip,
  Mic,
  Send,
  Phone,
  Video,
  Search,
  MoreVertical,
  Users,
  ArrowLeft,
  Image,
  FileText,
} from "lucide-react";
import type { Message, User, Chat, Group } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageBubble } from "./message-bubble";
import { ForwardMessageDialog } from "./forward-message-dialog";
import { Sidebar } from "./sidebar";
import { GroupDetailsDialog } from "./group-details-dialog";
import { UserProfileSidebar } from "./user-profile-sidebar";
import { DeleteMessageDialog } from "./delete-message-dialog";
import { AudioRecorder } from "./audio-recorder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Chat() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [showGroupDetailsDialog, setShowGroupDetailsDialog] = useState(false);
  const [showUserProfileSidebar, setShowUserProfileSidebar] = useState(false);
  const [showDeleteMessageDialog, setShowDeleteMessageDialog] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const currentUser: User = {
    id: "1",
    name: "You",
    avatar: "/placeholder-user.jpg",
    isOnline: true,
    status: "Available",
    contactNumber: "+1234567890",
    personalInfo: "I love coding!",
  };

  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      name: "Adalberto Granzin",
      avatar: "/placeholder-user.jpg",
      isGroup: false,
      participants: [
        {
          id: "2",
          name: "Adalberto Granzin",
          avatar: "/placeholder-user.jpg",
          isOnline: true,
          role: "UI/UX Designer",
        },
      ],
      lastMessage: {
        id: "1",
        content:
          "Can I get details of my last transaction I made last month? 💳",
        senderId: "2",
        timestamp: new Date("2024-01-08T13:16:00"),
        type: "text",
        sender: "",
      },
      unreadCount: 0,
      admins: undefined,
    },
    // Add more chats as over here
  ]);

  const isNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 100; // pixels from bottom
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold
    );
  };

  useEffect(() => {
    if (shouldAutoScroll && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, shouldAutoScroll]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShouldAutoScroll(isNearBottom());
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUser.id,
      timestamp: new Date(),
      type: "text",
      sender: "",
    };

    setMessages([...messages, message]);
    setNewMessage("");
    setShouldAutoScroll(true);

    setChats(
      chats.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, lastMessage: message, unreadCount: 0 }
          : chat
      )
    );
  };

  const handleSelectChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setSelectedChat(chat);
      setMessages([
        {
          id: "1",
          content:
            "Can I get details of my last transaction I made last month? 💳",
          senderId: "2",
          timestamp: new Date("2024-01-08T13:16:00"),
          type: "text",
          sender: "",
        },
        {
          id: "2",
          content: "We need to check if we can provide you such information.",
          senderId: "1",
          timestamp: new Date("2024-01-08T13:17:00"),
          type: "text",
          sender: "",
        },
        {
          id: "3",
          content: "I will inform you as I get update on this.",
          senderId: "1",
          timestamp: new Date("2024-01-08T13:18:00"),
          type: "text",
          sender: "",
        },
        {
          id: "4",
          content: "If it takes long you can mail me at my mail address.",
          senderId: "2",
          timestamp: new Date("2024-01-08T21:45:00"),
          type: "text",
          sender: "",
        },
      ]);
    }
  };

  const handleCreateGroup = (newGroup: Group) => {
    setChats((prevChats) => [...prevChats, newGroup]);
    setSelectedChat(newGroup);
    setMessages([
      {
        id: Date.now().toString(),
        content: `${currentUser.name} created group "${newGroup.name}"`,
        senderId: currentUser.id,
        timestamp: new Date(),
        type: "text",
        sender: "",
      },
    ]);
  };

  const handleForwardMessage = (message: Message, targetChats: Chat[]) => {
    targetChats.forEach((chat) => {
      const forwardedMessage: Message = {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
        forwardedFrom: selectedChat?.name,
      };

      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === chat.id
            ? {
                ...c,
                lastMessage: forwardedMessage,
                unreadCount: c.unreadCount + 1,
              }
            : c
        )
      );

      if (chat.id === selectedChat?.id) {
        setMessages((prevMessages) => [...prevMessages, forwardedMessage]);
      }
    });

    setShowForwardDialog(false);
    if (targetChats.length > 0) {
      handleSelectChat(targetChats[0].id);
    }
  };

  const handleDeleteMessage = (
    messageId: string,
    deleteForEveryone: boolean
  ) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId
          ? { ...msg, isDeleted: true, isDeletedForEveryone: deleteForEveryone }
          : msg
      )
    );
    setShowDeleteMessageDialog(false);
  };

  const handleUpdateUserProfile = (updatedUser: User) => {
    console.log("Updating user profile:", updatedUser);
    setShowUserProfileSidebar(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedChat) {
      const fileType = file.type.startsWith("image/") ? "image" : "pdf";
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string;
        const newMessage: Message = {
          id: Date.now().toString(),
          content: file.name,
          senderId: currentUser.id,
          timestamp: new Date(),
          type: fileType,
          fileUrl: fileUrl,
          sender: "",
        };
        setMessages([...messages, newMessage]);
        setChats(
          chats.map((chat) =>
            chat.id === selectedChat.id
              ? { ...chat, lastMessage: newMessage, unreadCount: 0 }
              : chat
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioRecordingComplete = (audioBlob: Blob) => {
    if (selectedChat) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const audioUrl = e.target?.result as string;
        const newMessage: Message = {
          id: Date.now().toString(),
          content: "Audio message",
          senderId: currentUser.id,
          timestamp: new Date(),
          type: "audio",
          fileUrl: audioUrl,
          sender: "",
        };
        setMessages([...messages, newMessage]);
        setChats(
          chats.map((chat) =>
            chat.id === selectedChat.id
              ? { ...chat, lastMessage: newMessage, unreadCount: 0 }
              : chat
          )
        );
      };
      reader.readAsDataURL(audioBlob);
    }
  };

  const handleAudioStop = (audioBlob: Blob) => {
    console.log("Audio recorded:", audioBlob);
    setIsRecording(false);
  };

  const handleAudioCancel = () => {
    setIsRecording(false);
  };

  return (
    <div className="flex h-[600px] bg-[#F8F9FA] rounded-lg shadow-lg mx-auto my-4 max-w-[1000px]">
      <div className="w-[280px] border-r bg-white">
        <Sidebar
          currentUser={currentUser}
          chats={chats}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChat?.id || null}
          onCreateGroup={handleCreateGroup}
          onOpenUserProfile={() => setShowUserProfileSidebar(true)}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="flex items-center p-2 bg-white border-b">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-2 flex-1">
                <h2 className="font-semibold text-sm">{selectedChat.name}</h2>
                <p className="text-xs text-[#7C7C7D]">
                  {selectedChat.isGroup
                    ? `${selectedChat.participants.length} participants`
                    : "Online"}
                </p>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-hide"
              style={{
                msOverflowStyle: "none", // IE and Edge
                scrollbarWidth: "none", // Firefox
                WebkitOverflowScrolling: "touch",
              }}
            >
              <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={message.senderId === currentUser.id}
                  onDelete={() => {
                    setSelectedMessage(message);
                    setShowDeleteMessageDialog(true);
                  }}
                  onEdit={(content) => {
                    setMessages(
                      messages.map((msg) =>
                        msg.id === message.id
                          ? { ...msg, content, isEdited: true }
                          : msg
                      )
                    );
                    setEditingMessage(null);
                  }}
                  onForward={() => {
                    setSelectedMessage(message);
                    setShowForwardDialog(true);
                  }}
                  isEditing={editingMessage === message.id}
                  setEditing={setEditingMessage}
                />
              ))}
            </div>

            <div className="p-2 bg-white border-t">
              {isRecording ? (
                <AudioRecorder
                  onStop={handleAudioStop}
                  onCancel={handleAudioCancel}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsRecording(true)}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => newMessage.trim() && handleSend()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-[#7C7C7D]">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>

      <ForwardMessageDialog
        open={showForwardDialog}
        onOpenChange={setShowForwardDialog}
        message={selectedMessage}
        chats={chats}
        onForward={handleForwardMessage}
      />
      <DeleteMessageDialog
        open={showDeleteMessageDialog}
        onOpenChange={setShowDeleteMessageDialog}
        onDelete={handleDeleteMessage}
        messageId={selectedMessage?.id || ""}
      />
    </div>
  );
}
