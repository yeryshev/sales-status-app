import { Theme as MuiTheme, useTheme as useMuiTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { ThemeContext, Theme, LOCAL_STORAGE_THEME_KEY } from './ThemeContext';

interface UseThemeResult {
  theme: MuiTheme;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeResult {
  const theme = useMuiTheme<MuiTheme>();
  const { setTheme } = useContext(ThemeContext);
  const toggleTheme = () => {
    const newTheme = theme.palette.mode === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(newTheme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
  };

  return { theme, toggleTheme };
}
