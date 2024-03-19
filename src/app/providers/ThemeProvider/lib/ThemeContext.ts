import { createContext } from 'react';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface ThemeContextProps {
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextProps>({
    setTheme: () => {},
});
