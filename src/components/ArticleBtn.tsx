// src/components/InteractiveButton.tsx
import { createSignal } from "solid-js";

interface ButtonProps {
  articleId: number;
  speciesFilter: boolean;
  article_url: string;
}

const InteractiveButton = (props: ButtonProps) => {
  const [isLoading, setLoading] = createSignal(false);

  const handleClick = async () => {
    if (props.speciesFilter) {
      window.location.href = props.article_url; // Navigate to the URL
    } else {
      setLoading(true);
      await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: props.articleId, is_species: true }),
      });
      window.location.reload();
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className={`px-3 py-1 ${
          props.speciesFilter ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
        } text-xs py-1 px-3 text-white rounded disabled:bg-gray-400`}
        onClick={handleClick}
        disabled={isLoading()}
      >
        {isLoading()
          ? "Updating..."
          : props.speciesFilter
          ? "View Article"
          : "Add"}
      </button>
    </div>
  );
};

export default InteractiveButton;