import React, { useState } from "react";
import { createCategory } from "../api";

export default function CategoriesForm({ onSuccess }) {
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createCategory({ name });
      onSuccess();
      setName("");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre categoría" required />
      <button type="submit">Añadir categoría</button>
    </form>
  );
}

