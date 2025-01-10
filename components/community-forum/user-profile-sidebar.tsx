import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onUpdateProfile: (updatedUser: User) => void;
}

export function UserProfileSidebar({
  open,
  onOpenChange,
  user,
  onUpdateProfile,
}: UserProfileSidebarProps) {
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    onUpdateProfile(editedUser);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={editedUser.avatar} />
              <AvatarFallback>{editedUser.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editedUser.name}
              onChange={(e) =>
                setEditedUser({ ...editedUser, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={editedUser.status}
              onChange={(e) =>
                setEditedUser({ ...editedUser, status: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={editedUser.contactNumber}
              onChange={(e) =>
                setEditedUser({ ...editedUser, contactNumber: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personalInfo">Personal Info</Label>
            <Input
              id="personalInfo"
              value={editedUser.personalInfo}
              onChange={(e) =>
                setEditedUser({ ...editedUser, personalInfo: e.target.value })
              }
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
