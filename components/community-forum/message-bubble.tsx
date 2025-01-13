"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Edit2, Forward, MoreVertical, Trash, FileText } from "lucide-react";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onDelete: () => void;
  onEdit: (content: string) => void;
  onForward: () => void;
  isEditing: boolean;
  setEditing: (id: string | null) => void;
}

export function MessageBubble({
  message,
  isOwnMessage,
  onDelete,
  onEdit,
  onForward,
  isEditing,
  setEditing,
}: MessageBubbleProps) {
  const [editContent, setEditContent] = useState(message.content);

  const renderMessageContent = () => {
    switch (message.type) {
      case "image":
        return (
          <img
            src={message.fileUrl}
            alt="Image"
            className="max-w-full h-auto rounded-lg"
          />
        );
      case "pdf":
        return (
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {message.content}
            </a>
          </div>
        );
      case "audio":
        return (
          <audio controls className="max-w-full">
            <source src={message.fileUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        );
      default:
        return <p className="break-words">{message.content}</p>;
    }
  };

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} group`}
    >
      <div className="max-w-[70%] relative">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-w-[200px]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onEdit(editContent);
                }
                if (e.key === "Escape") {
                  setEditing(null);
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => onEdit(editContent)}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
            >
              Save
            </Button>
          </div>
        ) : (
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwnMessage ? "bg-[#8B5CF6] text-white" : "bg-white shadow-sm"
            }`}
          >
            {message.isDeleted ? (
              <span className="italic text-[#7C7C7D]">
                This message was deleted
              </span>
            ) : (
              <>
                {renderMessageContent()}
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs ${
                      isOwnMessage ? "text-white/70" : "text-[#7C7C7D]"
                    }`}
                  >
                    {format(message.timestamp, "h:mm a")}
                  </span>
                  {message.isEdited && (
                    <span
                      className={`text-xs ${
                        isOwnMessage ? "text-white/70" : "text-[#7C7C7D]"
                      }`}
                    >
                      (edited)
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {!message.isDeleted && !isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-0 ${
                  isOwnMessage
                    ? "left-0 -translate-x-full"
                    : "right-0 translate-x-full"
                } opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {isOwnMessage && message.type === "text" && (
                <>
                  <DropdownMenuItem onClick={() => setEditing(message.id)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={onForward}>
                <Forward className="h-4 w-4 mr-2" />
                Forward
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
