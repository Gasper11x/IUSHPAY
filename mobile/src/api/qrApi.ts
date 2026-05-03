// src/api/qrApi.ts
// ─────────────────────────────────────────────
// ÚNICO lugar donde se configura la URL de P1.
// Cuando P1 te pase su URL, solo cambia API_BASE.
// ─────────────────────────────────────────────

import axios from 'axios';

// ↓↓↓ CAMBIAR AQUÍ cuando P1 entregue la URL real ↓↓↓
const API_BASE = 'http://localhost:3000';
// ↑↑↑ ─────────────────────────────────────────── ↑↑↑

const client = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Tipos ────────────────────────────────────

export type GenerateQRResponse = {
  token: string;
};

export type ValidateQRSuccess = {
  valid: true;
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl: string | null;
  balance: number;
};

export type ValidateQRFailure = {
  valid: false;
  reason: 'expired' | 'invalid' | 'user_not_found' | 'wallet_not_found';
};

export type ValidateQRResponse = ValidateQRSuccess | ValidateQRFailure;

// ─── Mock local (semana 1-2) ──────────────────
// Cuando P1 esté listo, borrar estas funciones
// y descomentar las de abajo que usan axios.

const USE_MOCK = true; // ← cambiar a false cuando P1 esté listo

const MOCK_USER = {
  valid: true as const,
  userId: 'mock-user-123',
  userName: 'Santiago Taborda',
  userEmail: 'staborda@iush.edu.co',
  avatarUrl: null,
  balance: 45500,
};

async function mockGenerateQR(): Promise<GenerateQRResponse> {
  await new Promise(r => setTimeout(r, 400)); // simula latencia de red
  return { token: 'mock.jwt.token.' + Date.now() };
}

async function mockValidateQR(token: string): Promise<ValidateQRResponse> {
  await new Promise(r => setTimeout(r, 600));
  if (token.includes('expired')) {
    return { valid: false, reason: 'expired' };
  }
  return MOCK_USER;
}

// ─── Funciones reales (descomentar cuando P1 esté) ───
// async function realGenerateQR(userId: string): Promise<GenerateQRResponse> {
//   const res = await client.post('/api/qr/generate', { userId });
//   return res.data;
// }
// async function realValidateQR(token: string): Promise<ValidateQRResponse> {
//   const res = await client.post('/api/qr/validate', { token });
//   return res.data;
// }

// ─── Exports públicos ─────────────────────────

export async function generateQR(userId: string): Promise<GenerateQRResponse> {
  if (USE_MOCK) return mockGenerateQR();
  const res = await client.post('/api/qr/generate', { userId });
  return res.data;
}

export async function validateQR(token: string): Promise<ValidateQRResponse> {
  if (USE_MOCK) return mockValidateQR(token);
  const res = await client.post('/api/qr/validate', { token });
  return res.data;
}
