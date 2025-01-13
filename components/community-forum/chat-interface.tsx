"use client";

import { useState, useEffect } from "react";

function findContactById(_chatId: string): Contact | null {
  // Implement the logic to find and return the contact by chatId
  // This is a placeholder implementation
  return null;
}
import { Sidebar } from "./sidebar";
import { ChatWindow } from "./chat-window";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Contact, Group } from "@/types/chat";

export function ChatInterface() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  useEffect(() => {
    setShowSidebar(!isMobile || !selectedContact);
  }, [isMobile, selectedContact]);

  return (
    <div className="flex h-full bg-background">
      {showSidebar && (
        <div className={`${isMobile ? "w-full" : "w-[400px]"} border-r`}>
          <Sidebar
            onSelectChat={(chatId: string) => {
              const contact = findContactById(chatId);
              setSelectedContact(contact);
              if (isMobile) setShowSidebar(false);
            }}
            currentUser={{ id: "1", name: "Default User" }}
            chats={[]}
            selectedChatId={null}
            onCreateGroup={function (_group: Group): void {
              throw new Error("Function not implemented.");
            }}
            onOpenUserProfile={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
      )}
      {(!showSidebar || !isMobile) && (
        <div className="flex-1">
          <ChatWindow
            contact={selectedContact}
            onBack={() => {
              if (isMobile) {
                setShowSidebar(true);
                setSelectedContact(null);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
