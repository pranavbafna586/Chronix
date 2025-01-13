import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url?: string;
  source?: string;
  publishedAt?: string;
}

interface NewsFetcherProps {
  searchQuery?: string;
  limit?: number;
}

const NewsArticle: React.FC<{ article: Article }> = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9); // default aspect ratio

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {article.title}
        </h3>
        <div
          className="relative w-full mb-4"
          style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
        >
          {!imageError ? (
            <Image
              src={article.thumbnail}
              alt={article.title}
              onError={() => setImageError(true)}
              onLoad={handleImageLoad}
              className="absolute inset-0 w-full h-full object-contain"
              loading="lazy"
              width={16}
              height={9}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Image not available</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
          {article.description}
        </p>
        <div className="flex flex-col gap-1 text-sm text-gray-500 mt-auto">
          {article.source && <p>Source: {article.source}</p>}
          {article.publishedAt && <p>Published: {article.publishedAt}</p>}
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2"
            >
              Read full article →
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

const NewsFetcher: React.FC<NewsFetcherProps> = ({
  searchQuery = "",
  limit = 3,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        if (!apiKey) {
          throw new Error("News API key is not configured");
        }

        const baseUrl = "https://newsapi.org/v2";
        const endpoint = searchQuery.trim()
          ? `${baseUrl}/everything`
          : `${baseUrl}/top-headlines`;

        const params = new URLSearchParams({
          apiKey,
          ...(searchQuery.trim()
            ? {
                q: searchQuery,
                domains: "wsj.com",
              }
            : {
                country: "us",
              }),
        });

        const response = await fetch(`${endpoint}?${params}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "error") {
          throw new Error(data.message || "Failed to fetch articles");
        }

        const fetchedArticles: Article[] = data.articles
          .slice(0, limit)
          .map((article: any) => ({
            id: article.url,
            title: article.title || "Untitled",
            description: article.description || "No description available",
            thumbnail: article.urlToImage || "",
            url: article.url,
            source: article.source?.name,
            publishedAt: article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString()
              : undefined,
          }));

        setArticles(fetchedArticles);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load articles"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [searchQuery, limit]);

  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="w-full h-0 pb-[56.25%] relative mb-4" />{" "}
              {/* 16:9 aspect ratio */}
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center text-red-600">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {articles.length === 0 ? (
          <div className="col-span-full text-center p-8">
            <p className="text-lg text-gray-600">
              {searchQuery.trim()
                ? "No articles found for your search query."
                : "No articles available."}
            </p>
          </div>
        ) : (
          articles.map((article) => (
            <NewsArticle key={article.id} article={article} />
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFetcher;
