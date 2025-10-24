import { NextResponse } from 'next/server';

export const ok = (data: unknown, init?: ResponseInit) =>
  NextResponse.json({ success: true, data }, { status: 200, ...(init || {}) });

export const created = (data: unknown, init?: ResponseInit) =>
  NextResponse.json({ success: true, data }, { status: 201, ...(init || {}) });

export const badRequest = (message = 'Bad Request', details?: unknown) =>
  NextResponse.json({ success: false, message, details }, { status: 400 });

export const unauthorized = (message = 'Unauthorized') =>
  NextResponse.json({ success: false, message }, { status: 401 });

export const forbidden = (message = 'Forbidden') =>
  NextResponse.json({ success: false, message }, { status: 403 });

export const notFound = (message = 'Not Found') =>
  NextResponse.json({ success: false, message }, { status: 404 });

export const conflict = (message = 'Conflict') =>
  NextResponse.json({ success: false, message }, { status: 409 });

export const unprocessable = (message = 'Validation Error', errors?: unknown) =>
  NextResponse.json({ success: false, message, errors }, { status: 422 });

export const tooMany = (message = 'Too Many Requests') =>
  NextResponse.json({ success: false, message }, { status: 429 });

export const serverError = (message = 'Internal Server Error', details?: unknown) =>
  NextResponse.json({ success: false, message, details }, { status: 500 });

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
