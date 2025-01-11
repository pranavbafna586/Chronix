"use client";

import { useState } from "react";
import { Search, MoreVertical, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Chat, Group } from "@/types/chat";
import { CreateGroupDialog } from "./create-group-dialog";
import { format } from "date-fns";
import { UserProfileSidebar } from "./user-profile-sidebar";

interface SidebarProps {
  currentUser: User;
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
  onCreateGroup: (group: Group) => void;
  onOpenUserProfile: () => void;
}

export function Sidebar({
  currentUser,
  chats,
  onSelectChat,
  selectedChatId,
  onCreateGroup,
  onOpenUserProfile,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Add handler for profile updates
  const handleUpdateProfile = (updatedUser: User) => {
    // You might want to implement this in your parent component
    console.log("Profile updated:", updatedUser);
    setShowUserProfile(false);
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between">
        <Avatar
          className="h-10 w-10 cursor-pointer"
          onClick={() => setShowUserProfile(true)}
        >
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setShowCreateGroupDialog(true)}>
              Create a New Group
            </DropdownMenuItem>
            <DropdownMenuItem>Archive All Chats</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7C7C7D]" />
          <Input
            placeholder="Search or start new chat"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#F8F9FA] text-left ${
                chat.id === selectedChatId ? "bg-[#F8F9FA]" : ""
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback>{chat.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {!chat.isGroup && chat.participants[0].isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-[#1A1A1A] truncate">
                    {chat.name}
                  </span>
                  {chat.lastMessage && (
                    <span className="text-xs text-[#7C7C7D] whitespace-nowrap ml-2">
                      {format(new Date(chat.lastMessage.timestamp), "HH:mm")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#7C7C7D] truncate">
                  {chat.isGroup &&
                    chat.lastMessage?.senderId === currentUser.id &&
                    "You: "}
                  {chat.lastMessage?.content}
                </p>
                {chat.isGroup && (
                  <p className="text-xs text-[#7C7C7D]">
                    {chat.participants.length} participants
                    {chat.admins.includes(currentUser.id) && " • Admin"}
                  </p>
                )}
              </div>
              {chat.unreadCount > 0 && (
                <div className="bg-[#8B5CF6] text-white rounded-full px-2 py-1 text-xs">
                  {chat.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>

      <CreateGroupDialog
        open={showCreateGroupDialog}
        onOpenChange={setShowCreateGroupDialog}
        currentUser={currentUser}
        onCreateGroup={onCreateGroup}
      />

      <UserProfileSidebar
        open={showUserProfile}
        onOpenChange={setShowUserProfile}
        user={currentUser}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
}
