import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Group, User } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GroupDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group;
  currentUser: User;
  onRemoveMember: (userId: string) => void;
}

export function GroupDetailsDialog({
  open,
  onOpenChange,
  group,
  currentUser,
  onRemoveMember,
}: GroupDetailsDialogProps) {
  const isAdmin = group.admins.includes(currentUser.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} onClose={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{group.name} - Group Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            Members ({group.participants.length})
          </h3>
          <ScrollArea className="h-[300px]">
            {group.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>{participant.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{participant.name}</span>
                  {group.admins.includes(participant.id) && (
                    <span className="ml-2 text-xs text-[#7C7C7D]">Admin</span>
                  )}
                </div>
                {isAdmin && participant.id !== currentUser.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveMember(participant.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
