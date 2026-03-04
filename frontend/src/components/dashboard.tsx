import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTransactionsRequest,
  createTransactionRequest,
  deleteTransactionRequest,
  getCategoriesRequest,
  getTransactionTypesRequest,
  type Transaction,
  type Category,
  type TransactionType,
} from "../lib/api";

interface StoredUser {
  id: number;
  documentId: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New transaction form state
  const [showForm, setShowForm] = useState(false);
  const [formAmount, setFormAmount] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTypeId, setFormTypeId] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) {
      navigate("/login");
      return;
    }
    const parsedUser: StoredUser = JSON.parse(stored);
    setUser(parsedUser);

    const fetchData = async () => {
      try {
        const [txs, cats, txTypes] = await Promise.all([
          getTransactionsRequest(parsedUser.documentId),
          getCategoriesRequest(parsedUser.documentId),
          getTransactionTypesRequest(),
        ]);
        setTransactions(txs);
        setCategories(cats);
        setTypes(txTypes);
        if (txTypes.length > 0) setFormTypeId(String(txTypes[0].id));
        if (cats.length > 0) setFormCategoryId(String(cats[0].id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormError(null);
    setFormLoading(true);
    try {
      const newTx = await createTransactionRequest({
        amount: parseFloat(formAmount),
        description: formDescription || undefined,
        typeId: parseInt(formTypeId),
        categoryId: formCategoryId ? parseInt(formCategoryId) : undefined,
        date: formDate || undefined,
        documentId: user.documentId,
      });
      setTransactions((prev) => [newTx, ...prev]);
      setFormAmount("");
      setFormDescription("");
      setFormDate("");
      setShowForm(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Error al crear transacción",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!user) return;
    if (!confirm("¿Eliminar esta transacción?")) return;
    try {
      await deleteTransactionRequest(uuid, user.documentId);
      setTransactions((prev) => prev.filter((t) => t.uuid !== uuid));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  // Summary calculations
  const totalIncome = transactions
    .filter((t) => t.type.name === "INCOME")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type.name === "EXPENSE")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <img src="/finance.svg" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold">Finance Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-90">Hola, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
            {error}
          </p>
        )}

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
            <p className="text-sm text-gray-500 mb-1">Ingresos Totales</p>
            <p className="text-2xl font-bold text-green-600">
              +{totalIncome.toFixed(2)} €
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500">
            <p className="text-sm text-gray-500 mb-1">Gastos Totales</p>
            <p className="text-2xl font-bold text-red-600">
              -{totalExpenses.toFixed(2)} €
            </p>
          </div>
          <div
            className={`bg-white rounded-lg shadow p-5 border-l-4 ${balance >= 0 ? "border-blue-500" : "border-orange-500"}`}
          >
            <p className="text-sm text-gray-500 mb-1">Balance</p>
            <p
              className={`text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-orange-600"}`}
            >
              {balance >= 0 ? "+" : ""}
              {balance.toFixed(2)} €
            </p>
          </div>
        </section>

        {/* Transactions Section */}
        <section className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Transacciones
            </h2>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition-colors"
            >
              {showForm ? "Cancelar" : "+ Nueva transacción"}
            </button>
          </div>

          {/* Add Transaction Form */}
          {showForm && (
            <form
              onSubmit={handleAddTransaction}
              className="px-6 py-4 bg-blue-50 border-b space-y-4"
            >
              <h3 className="font-medium text-gray-700">Nueva Transacción</h3>
              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {formError}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Descripción opcional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo *
                  </label>
                  <select
                    value={formTypeId}
                    onChange={(e) => setFormTypeId(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    required
                  >
                    {types.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name === "INCOME" ? "Ingreso" : "Gasto"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors disabled:opacity-60"
              >
                {formLoading ? "Guardando..." : "Guardar"}
              </button>
            </form>
          )}

          {/* Transaction List */}
          {transactions.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              No hay transacciones. ¡Añade la primera!
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {transactions.map((tx) => {
                const isIncome = tx.type.name === "INCOME";
                return (
                  <li
                    key={tx.uuid}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${isIncome ? "bg-green-500" : "bg-red-400"}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {tx.description ||
                            tx.category?.name ||
                            "Sin categoría"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {tx.category?.name ?? "Sin categoría"} ·{" "}
                          {new Date(tx.date).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-semibold text-sm ${isIncome ? "text-green-600" : "text-red-500"}`}
                      >
                        {isIncome ? "+" : "-"}
                        {Math.abs(tx.amount).toFixed(2)} €
                      </span>
                      <button
                        onClick={() => handleDelete(tx.uuid)}
                        className="text-gray-300 hover:text-red-500 text-xs transition-colors"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
