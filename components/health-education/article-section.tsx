"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface Article {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url?: string; // For the original article link
  source?: string; // For the news source
  publishedAt?: string; // For the publication date
}

interface ArticleSectionProps {
  searchQuery: string;
}

export function ArticleSection({ searchQuery }: ArticleSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const getPlaceholderImage = (width: number, height: number) => {
    return `https://via.placeholder.com/${width}x${height}`;
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = getPlaceholderImage(400, 300);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        if (!apiKey) {
          throw new Error("API key is missing. Check your .env.local file.");
        }

        // Determine the URL based on whether a search query is provided
        const url = searchQuery.trim()
          ? `https://newsapi.org/v2/everything?domains=wsj.com&apiKey=${apiKey}&q=${encodeURIComponent(
              searchQuery
            )}`
          : `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "error") {
          throw new Error(data.message || "Failed to fetch articles");
        }

        const fetchedArticles: Article[] = data.articles
          .slice(0, 3)
          .map((article: any) => ({
            id: article.url,
            title: article.title || "Untitled",
            description: article.description || "No description available",
            thumbnail: article.urlToImage || getPlaceholderImage(400, 300),
            url: article.url,
            source: article.source?.name,
            publishedAt: article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString()
              : undefined,
          }));

        setArticles(fetchedArticles);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load articles."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-lg">Loading articles...</p>
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
    <section className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Articles</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <Card
              key={article.id}
              className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedArticle(article)}
            >
              <CardHeader>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="relative w-full h-48 mb-4">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <CardDescription className="line-clamp-3">
                  {article.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog
        open={!!selectedArticle}
        onOpenChange={(open) => !open && setSelectedArticle(null)}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedArticle?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <img
              src={selectedArticle?.thumbnail}
              alt={selectedArticle?.title}
              onError={handleImageError}
              className="w-full h-[300px] object-cover rounded-md mb-4"
            />

            <p className="text-base text-gray-700 mb-4">
              {selectedArticle?.description}
            </p>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              {selectedArticle?.source && (
                <p>Source: {selectedArticle.source}</p>
              )}
              {selectedArticle?.publishedAt && (
                <p>Published: {selectedArticle.publishedAt}</p>
              )}
              {selectedArticle?.url && (
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2"
                >
                  Read full article →
                </a>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
