import { ReactNode, useMemo, useState } from 'react';
import { ColorModeCtx } from './index.ts';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ColorModeCtxProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      setColorMode: (mode: 'light' | 'dark') => setMode(mode),
    }),
    []
  );

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ColorModeCtx.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeCtx.Provider>
  );
};

export default ColorModeCtxProvider;
