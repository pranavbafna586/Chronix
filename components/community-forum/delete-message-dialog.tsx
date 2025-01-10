import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (messageId: string, deleteForEveryone: boolean) => void;
  messageId: string;
}

export function DeleteMessageDialog({
  open,
  onOpenChange,
  onDelete,
  messageId,
}: DeleteMessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} onClose={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Message</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p>How would you like to delete this message?</p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                onDelete(messageId, false);
                onOpenChange(false);
              }}
            >
              Delete for Me
            </Button>
            <Button
              onClick={() => {
                onDelete(messageId, true);
                onOpenChange(false);
              }}
            >
              Delete for Everyone
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
