"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { User, Group } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User;
  onCreateGroup: (group: Group) => void;
}

export function CreateGroupDialog({
  open,
  onOpenChange,
  currentUser,
  onCreateGroup,
}: CreateGroupDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    console.log("Create Group Modal state changed:", open);
    if (!open) {
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    console.log("Create group dialog state changing to:", newOpen);
    if (!newOpen) {
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    }
    onOpenChange(newOpen);
  };

  // Mock users data
  const users: User[] = [
    {
      id: "2",
      name: "Felecia Rower",
      avatar: "/placeholder-user.jpg",
      isOnline: true,
    },
    {
      id: "3",
      name: "Zenia Jacobs",
      avatar: "/placeholder-user.jpg",
      isOnline: true,
    },
    // Add more users as needed
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
  );

  const toggleUser = (user: User) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleCreateGroup = () => {
    if (groupName && selectedUsers.length > 0) {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: groupName,
        isGroup: true,
        participants: [currentUser, ...selectedUsers],
        admins: [currentUser.id],
        unreadCount: 0,
        avatar: "/placeholder-group.jpg", // Add a placeholder group avatar
        lastMessage: {
          id: Date.now().toString(),
          content: `${currentUser.name} created group "${groupName}"`,
          senderId: currentUser.id,
          timestamp: new Date(),
          type: "text",
          sender: ""
        },
      };
      onCreateGroup(newGroup);
      onOpenChange(false); // Close the dialog after creating the group
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Create a New Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7C7C7D]" />
            <Input
              placeholder="Search contacts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center bg-[#F8F9FA] rounded-full pl-2 pr-1 py-1"
                >
                  <span className="text-sm">{user.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => toggleUser(user)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => toggleUser(user)}
                  className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#F8F9FA]"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-left text-[#1A1A1A]">
                    {user.name}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-[#1A1A1A]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={!groupName || selectedUsers.length === 0}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
            >
              Create Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
