import { createAsyncThunk } from '@reduxjs/toolkit';
import { Teammate } from '../../../app/types/Team';

export const setTeam = createAsyncThunk('team/setTeam', async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/team`, {
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
