import { createSignal, onMount } from "solid-js";
import InteractiveButton from "./InteractiveButton";
import type { Article } from "../types/article_type";

const ArticleList = () => {
  const [articles, setArticles] = createSignal<Article[]>([]);

  onMount(async () => {
    console.log("Fetching articles...");
    const response = await fetch("/api/articles?species=false"); // Fetch articles with null, true, or false
    if (!response.ok) {
      console.error("Failed to fetch articles");
      return;
    }
    const data = await response.json();
    console.log("Fetched articles:", data);
    setArticles(data);
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Species Articles</h1>
      <h2 className="text-lg font-semibold">Total: {articles().length}</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles().map((article) => (
          <li key={article.id} className="border rounded-lg p-4 shadow-md">
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-40 object-cover rounded"
              />
            )}
            <h3 className="font-semibold mt-2">{article.title}</h3>
            <InteractiveButton articleId={article.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleList;
