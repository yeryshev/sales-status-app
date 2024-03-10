import { type ReactNode, useMemo, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ThemeContext, Theme } from '../lib/ThemeContext.ts'
import { LOCAL_STORAGE_THEME_KEY } from '@/shared/const/localStorage.ts';

const defaultTheme = (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme) || Theme.LIGHT

const ToggleColorMode = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<Theme>(defaultTheme)
    const colorMode = useMemo(
        () => ({
            setTheme: (theme: Theme) => {
                setMode(theme)
            }
        }),
        []
    )

    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])

    return (
        <ThemeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    )
}

export default ToggleColorMode
