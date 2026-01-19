import React, { useEffect, useState } from "react";
import { createExpense, fetchCategories } from "../api";

export default function ExpensesForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch {
      setError("Error cargando categorías");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (amount <= 0) {
      setError("El importe debe ser mayor que 0");
      return;
    }

    if (!category) {
      setError("Debes seleccionar una categoría");
      return;
    }

    setSubmitting(true);

    try {
      await createExpense({
        amount: Number(amount),
        category: Number(category),
        date,
      });

      setAmount("");
      setCategory("");
      setDate("");
      onSuccess();
      setSuccess("Gasto añadido correctamente");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.message || "Error al crear gasto");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nuevo gasto</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className= "expense-form" >

        <input
        type="number"
        step="0.01"
        value={amount}
        onChange={e => {
          setAmount(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Importe"
        />

        <select
          className="input"
          value={category}
          onChange={e => {
            setCategory(e.target.value);
            if (error) setError(null);
          }}
        >
          <option value="">-- Selecciona categoría --</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Añadiendo..." : "Añadir gasto"}
        </button>
        
      </div>
      
    </form>
  );
}
