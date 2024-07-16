import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '@/shared/lib/hooks/useTheme';
import { Theme } from '@/shared/const/theme';

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <IconButton data-testid="theme-switcher" sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
      {theme.palette.mode === Theme.DARK ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};
