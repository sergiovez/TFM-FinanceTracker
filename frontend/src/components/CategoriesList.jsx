import React, { useEffect, useState } from "react";
import { fetchCategories } from "../api";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Mis categorías</h2>
      <ul>
        {categories.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

