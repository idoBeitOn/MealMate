import { useEffect, useState } from "react";
import axios from "axios";

function Feed() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/recipes");
        setRecipes(res.data);
      } catch (err) {
        setError("Failed to fetch recipes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Recipe Feed</h1>
      {recipes.length === 0 && <p>No recipes found.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-2">{recipe.title}</h2>
            <p className="text-gray-700 mb-2">{recipe.description}</p>
            <p className="text-sm text-gray-500">
              Author: {recipe.author?.username || "Unknown"}
            </p>
            <p className="text-sm text-gray-500">Likes: {recipe.likesCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
