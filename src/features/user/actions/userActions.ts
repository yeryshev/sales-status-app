import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../../types/User';

export const checkUser = createAsyncThunk('auth/checkUser', async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/check`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const user: User = await response.json();
      return user;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
});

export const clearUser = createAsyncThunk('auth/clearUser', async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/jwt/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
});

export const updateUser = createAsyncThunk('user/updateUser', async (user: User) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${user.id}`, {
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
  } catch (error) {
    return null;
  }
});
