// src/components/ArticleList.tsx
import { createSignal, onMount } from "solid-js";
import type { Article } from "../types/article_type";
import ArticleItem from "./ArticleItem";

interface ArticleListProps {
  speciesFilter: boolean;
}

const ArticleList = (props: ArticleListProps) => {
  const [articles, setArticles] = createSignal<Article[]>([]);

  onMount(async () => {
    console.log("Fetching articles...");
    try {
      const response = await fetch(`${import.meta.env.API_URL}/api/articles?species=${props.speciesFilter}`);
      if (!response.ok) throw new Error("Failed to fetch articles");

      const data = await response.json();
      console.log("Fetched articles:", data);
      setArticles(data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <ul className="space-y-3 px-1">
      {articles().map((article) => (
        <ArticleItem article={article} speciesFilter={props.speciesFilter} /> // Pass speciesFilter
      ))}
    </ul>
  );
};

export default ArticleList;