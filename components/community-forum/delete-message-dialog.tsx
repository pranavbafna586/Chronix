import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

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
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    console.log("Modal state changed:", open);

    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else {
      // Cleanup when modal closes
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
      console.log("Cleaning up modal...");
    }

    // Cleanup function
    return () => {
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
      console.log("Modal component unmounted");
    };
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    console.log("handleOpenChange called:", newOpen);
    if (!newOpen) {
      // Force cleanup when closing
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onClick={(e) => {
          e.stopPropagation();
          console.log("Dialog content clicked");
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Message</DialogTitle>
          <DialogDescription>
            How would you like to delete this message?
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                onDelete(messageId, false);
                onOpenChange(false);
              }}
              aria-label="Delete message for me only"
            >
              Delete for Me
            </Button>
            <Button
              onClick={() => {
                onDelete(messageId, true);
                onOpenChange(false);
              }}
              aria-label="Delete message for everyone"
            >
              Delete for Everyone
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
