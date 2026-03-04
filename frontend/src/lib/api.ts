const API_URL = import.meta.env.VITE_API_URL;

export interface AuthUser {
  documentId: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  userId: number;
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
  return data;
}

export async function registerRequest(name: string, email: string, password: string): Promise<RegisterResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al registrarse');
  return data;
}

export interface Transaction {
  uuid: string;
  amount: number;
  date: string;
  description: string | null;
  category: { name: string };
  type: { name: string };
}

export async function getTransactionsRequest(documentId: string): Promise<Transaction[]> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/transactions?documentId=${encodeURIComponent(documentId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener transacciones');
  return data;
}

export interface CreateTransactionData {
  amount: number;
  description?: string;
  typeId: number;
  categoryId?: number;
  date?: string;
  documentId: string;
}

export async function createTransactionRequest(payload: CreateTransactionData): Promise<Transaction> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al crear transacción');
  return data;
}

export async function deleteTransactionRequest(uuid: string, documentId: string): Promise<void> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ uuid, documentId }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al eliminar transacción');
  }
}

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string | null;
}

export interface TransactionType {
  id: number;
  name: string;
  icon: string | null;
}

export async function getCategoriesRequest(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener categorías');
  return data;
}

export async function getTypesRequest(): Promise<TransactionType[]> {
  const res = await fetch(`${API_URL}/types`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener tipos');
  return data;
}