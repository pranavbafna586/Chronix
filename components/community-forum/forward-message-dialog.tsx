import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message, Chat } from "@/types/chat";
import { Check } from "lucide-react";

interface ForwardMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: Message | null;
  chats: Chat[];
  onForward: (message: Message, targetChats: Chat[]) => void;
}

export function ForwardMessageDialog({
  open,
  onOpenChange,
  message,
  chats,
  onForward,
}: ForwardMessageDialogProps) {
  const [selectedChats, setSelectedChats] = useState<Chat[]>([]);

  const handleForward = () => {
    if (message && selectedChats.length > 0) {
      onForward(message, selectedChats);
      setSelectedChats([]);
      onOpenChange(false); // Close the dialog after forwarding
    }
  };

  const toggleChat = (chat: Chat) => {
    setSelectedChats((prev) =>
      prev.some((c) => c.id === chat.id)
        ? prev.filter((c) => c.id !== chat.id)
        : [...prev, chat]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} onClose={() => onOpenChange(false)}> {/* Added onClose */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Forward Message</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ScrollArea className="h-[300px]">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded"
                onClick={() => toggleChat(chat)}
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{chat.name}</span>
                </div>
                {selectedChats.some((c) => c.id === chat.id) && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
              </button>
            ))}
          </ScrollArea>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleForward} disabled={selectedChats.length === 0}>
            Forward
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
