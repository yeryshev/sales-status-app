import { createAsyncThunk } from '@reduxjs/toolkit';
import { type User } from '../types/User';

export const checkUser = createAsyncThunk('auth/checkUser', async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const user: User = await response.json();
      return user;
    }
  } catch {
    return undefined;
  }
});

export const clearUser = createAsyncThunk('auth/clearUser', async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ user, deadline }: { user: User; deadline?: string }) => {
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/users/me`;
    const url = deadline ? `${baseUrl}?deadline=${deadline}` : `${baseUrl}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
        }),
      });
      if (response.ok) {
        const user: User = await response.json();
        return user;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  },
);
