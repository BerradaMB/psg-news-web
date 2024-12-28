import { Newspaper, X } from 'lucide-react';
import  { useEffect, useState } from 'react';
import { Card, CardContent } from './components/ui/card';

const PSGNews = () => {
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3000/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news articles');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        <header className="flex items-center justify-center mb-8">
          <Newspaper className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">PSG News</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* News List */}
          <div className="space-y-4">
            {news.map((article, index) => (
              <Card 
                key={index}
                className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
                  selectedArticle?.link === article.link ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleArticleClick(article)}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-48 relative">
                    <img
                      src={article.image || "/api/placeholder/400/300"}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1 text-sm">
                      {article.source}
                    </div>
                  </div>
                  <CardContent className="flex-1 p-4">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {article.description}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}

            {news.length === 0 && !loading && !error && (
              <div className="text-center py-8">
                <p className="text-gray-600">No news articles available</p>
              </div>
            )}
          </div>

          {/* Article Iframe */}
          <div className="lg:sticky lg:top-4 h-[calc(100vh-8rem)]">
            {selectedArticle ? (
              <Card className="h-full">
                <div className="p-4 border-b flex justify-between items-center bg-white">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {selectedArticle.title}
                  </h3>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    aria-label="Close preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="h-[calc(100%-4rem)]">
                  <iframe
                    src={selectedArticle.link}
                    title={selectedArticle.title}
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                </div>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-center">
                  Select an article to view its content
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSGNews;