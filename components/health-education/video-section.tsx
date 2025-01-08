import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
}

interface VideoSectionProps {
  searchQuery: string
}

export function VideoSection({ searchQuery }: VideoSectionProps) {
  const [videos, setVideos] = useState<Video[]>([])

  useEffect(() => {
    // Mock API call - replace with actual API in production
    const fetchVideos = async () => {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockVideos: Video[] = [
        { id: "1", title: "Exercise Techniques", description: "Learn proper exercise form for better results.", thumbnail: "/placeholder.svg?height=100&width=200", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        { id: "2", title: "Stress Management", description: "Discover effective ways to manage stress.", thumbnail: "/placeholder.svg?height=100&width=200", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        { id: "3", title: "Healthy Cooking Tips", description: "Quick and easy healthy cooking techniques.", thumbnail: "/placeholder.svg?height=100&width=200", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      ]
      
      setVideos(mockVideos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    }

    fetchVideos()
  }, [searchQuery])

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Videos</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map(video => (
          <Dialog key={video.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer">
                <CardHeader>
                  <CardTitle>{video.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover mb-2 rounded-md" />
                  <CardDescription>{video.description}</CardDescription>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{video.title}</DialogTitle>
              </DialogHeader>
              <div className="aspect-video">
                <iframe
                  src={video.videoUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  )
}

