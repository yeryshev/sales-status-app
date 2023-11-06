import { createContext, useContext } from 'react';

export const ColorModeCtx = createContext({
  toggleColorMode: () => {},
  setColorMode: (mode: 'light' | 'dark') => {
    console.log(mode);
  },
});

export const useColorModeCtx = () => useContext(ColorModeCtx);
