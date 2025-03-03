import { createSignal } from "solid-js";

interface ButtonProps {
  articleId: number;
}

const InteractiveButton = (props: ButtonProps) => {
  const [isLoading, setLoading] = createSignal(false);

  const updateSpeciesStatus = async (status: boolean) => {
    setLoading(true);
    await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: props.articleId, is_species: status }),
    });
    window.location.reload();
  };

  return (
    <div className="flex gap-2">
      <button
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        onClick={() => updateSpeciesStatus(true)}
        disabled={isLoading()}
      >
        {isLoading() ? "Updating..." : "Mark as Species"}
      </button>
      <button
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
        onClick={() => updateSpeciesStatus(false)}
        disabled={isLoading()}
      >
        {isLoading() ? "Updating..." : "Mark as Not Species"}
      </button>
    </div>
  );
};

export default InteractiveButton;
