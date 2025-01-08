"use client";

import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import NewsFetcher from "@/components/health-education/NewsFetcher-section";
import { VideoSection } from "@/components/health-education/video-section";

export default function EducationContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger search in child components
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Health Education</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for health topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">Search</Button>
      </form>

      <NewsFetcher searchQuery={searchQuery} />
      <VideoSection searchQuery={searchQuery} />
    </div>
  );
}
