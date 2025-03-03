import type { Article } from "../types/article_type";
import InteractiveButton from "./ArticleBtn";
import RemoveBtn from "./RemoveBtn";

interface ArticleItemProps {
  article: Article;
  speciesFilter: boolean;
}

const ArticleItem = (props: ArticleItemProps) => {
  const { article, speciesFilter } = props;

  return (
    <li key={article.id} className="flex border rounded-lg shadow bg-white p-2 h-28">
      {/* Image Column */}
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="h-full w-32 object-cover rounded-md"
        />
      )}

      {/* Metadata Column */}
      <div className="flex flex-col flex-grow ml-3">
        <h3 className="font-small text-xs ">{article.title}</h3>

        {/* Buttons */}
        <div className="mt-auto flex space-x-2">
          <div className="mt-auto flex space-x-2">
        <InteractiveButton
          articleId={article.id}
          speciesFilter={speciesFilter}
          article_url={article.link}
        />
        {speciesFilter && <RemoveBtn articleId={article.id} />}
      </div>
        </div>
      </div>
    </li>
  );
};

export default ArticleItem;