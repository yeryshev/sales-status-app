import { createAsyncThunk } from '@reduxjs/toolkit';
import { Teammate } from '../../../types/Team';

export const setTeam = createAsyncThunk('team/setTeam', async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const team: Teammate[] = await response.json();
      return team;
    } else {
      return [];
    }
  } catch (error: unknown) {
    return [];
  }
});
