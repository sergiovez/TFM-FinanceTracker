// Importamos el componente principal del Dashboard
import Dashboard from "../components/Dashboard";
// Hook para cargar todos los datos del dashboard
import { useBootstrapData } from "../hooks/useBootstrapData";

export default function Summary() {
  // Cargamos todos los datos de la API
  const {
    categoryData,
    monthlyData,
    latestExpenses,
    incomeSummary,
    loading,
    error,
  } = useBootstrapData();

  // Mostramos mensaje mientras cargan los datos
  if (loading) return <p>Cargando resumen...</p>;
  if (error) return <p className="error">{error}</p>;

  // Renderizamos Dashboard con los datos reales
  return (
    <Dashboard
      categoryData={categoryData}
      monthlyData={monthlyData}
      latestExpenses={latestExpenses}
      incomeSummary={incomeSummary}
    />
  );
}
