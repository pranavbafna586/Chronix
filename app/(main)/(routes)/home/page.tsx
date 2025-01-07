"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { contentComponents, type ContentKey } from "@/components/content"

export default function Home() {
  const [activeContent, setActiveContent] = useState<ContentKey>("home")
  const ContentComponent = contentComponents[activeContent]

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex pt-16">
        <Sidebar 
          activeContent={activeContent} 
          setActiveContent={setActiveContent} 
        />
        <main className="flex-1 p-8 ml-64">
          <ContentComponent />
        </main>
      </div>
    </div>
  )
}

