import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

interface VideoSectionProps {
  searchQuery: string;
}

export function VideoSection({ searchQuery }: VideoSectionProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const options = {
          method: "GET",
          url: "https://youtube-v31.p.rapidapi.com/search",
          params: {
            q: searchQuery || "health and wellness",
            part: "id,snippet",
            type: "video",
            maxResults: "3",
          },
          headers: {
            "x-rapidapi-key": process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "",
            "x-rapidapi-host": "youtube-v31.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        setVideos(response.data.items);
      } catch (err) {
        setError("Failed to fetch videos. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call to avoid too many requests while typing
    const timeoutId = setTimeout(() => {
      fetchVideos();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Videos</h2>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Dialog key={video.id.videoId}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {video.snippet.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      className="w-full h-32 object-cover mb-2 rounded-md"
                    />
                    <CardDescription className="line-clamp-2">
                      {video.snippet.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{video.snippet.title}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </section>
  );
}

export default VideoSection;
