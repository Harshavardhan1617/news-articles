import { createSignal } from "solid-js";

interface ButtonProps {
  articleId: number;
}

const RemoveBtn = (props: ButtonProps) => {
  const [isLoading, setLoading] = createSignal(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: props.articleId, is_species: false }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error removing article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className={`bg-red-500 hover:bg-red-600 text-xs py-1 px-3 text-white rounded disabled:bg-gray-400`}
        onClick={handleClick}
        disabled={isLoading()}
      >
        {isLoading() ? "Updating..." : "Remove"}
      </button>
    </div>
  );
};

export default RemoveBtn;