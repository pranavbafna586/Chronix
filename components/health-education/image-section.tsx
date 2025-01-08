"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
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

interface HealthImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
}

interface ImageSectionProps {
  searchQuery: string;
}

export function ImageSection({ searchQuery }: ImageSectionProps) {
  const [images, setImages] = useState<HealthImage[]>([]);
  const [loading, setLoading] = useState(false);

  const getPlaceholderImage = (width: number, height: number) => {
    return `/api/placeholder/${width}/${height}`;
  };

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockImages: HealthImage[] = [
        {
          id: "1",
          title: "Healthy Meal Prep",
          description:
            "A variety of colorful, nutritious meals prepared in advance for the week, featuring lean proteins, whole grains, and fresh vegetables.",
          imageUrl: getPlaceholderImage(400, 300),
          source: "Health Food Magazine",
        },
        {
          id: "2",
          title: "Yoga Poses for Beginners",
          description:
            "Essential yoga poses demonstrated with proper form and alignment, perfect for those starting their yoga journey.",
          imageUrl: getPlaceholderImage(400, 300),
          source: "Yoga Journal",
        },
        {
          id: "3",
          title: "Human Anatomy Guide",
          description:
            "Comprehensive diagram showing detailed views of the human muscular and skeletal systems with labeled parts.",
          imageUrl: getPlaceholderImage(400, 300),
          source: "Medical Encyclopedia",
        },
      ];

      setImages(
        mockImages.filter(
          (image) =>
            image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            image.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setLoading(false);
    };

    fetchImages();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-lg">Loading images...</p>
      </div>
    );
  }

  return (
    <section className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Images</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.length === 0 ? (
          <div className="col-span-full text-center p-8">
            <p className="text-lg text-gray-600">
              {searchQuery.trim()
                ? "No images found for your search query."
                : "Enter a search term to find images."}
            </p>
          </div>
        ) : (
          images.map((image) => (
            <Dialog key={image.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {image.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-48 mb-4">
                      <Image
                        src={image.imageUrl}
                        alt={image.title}
                        fill
                        className="rounded-md object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <CardDescription className="line-clamp-2">
                      {image.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[675px]">
                <DialogHeader>
                  <DialogTitle>{image.title}</DialogTitle>
                </DialogHeader>
                <div className="relative h-[500px] w-full">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="rounded-md object-contain"
                    sizes="(max-width: 768px) 100vw, 675px"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {image.description}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Source: {image.source}
                </p>
              </DialogContent>
            </Dialog>
          ))
        )}
      </div>
    </section>
  );
}
