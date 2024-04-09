import CssBaseline from '@mui/material/CssBaseline';
import { type ReactNode, useCallback, useState } from 'react';
import { Navbar } from '@/widgets/Navbar';
import Box from '@mui/material/Box';
import { Sidebar } from '@/widgets/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const [sideBarOpen, setSideBarOpen] = useState(false);

    const toggleSideBar = useCallback(
        () => (event?: KeyboardEvent | MouseEvent) => {
            if (
                event?.type === 'keydown' &&
                ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
            setSideBarOpen(!sideBarOpen);
        },
        [setSideBarOpen, sideBarOpen],
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navbar toggleSideBar={toggleSideBar} />
            <Sidebar sideBarOpen={sideBarOpen} toggleSideBar={toggleSideBar} />
            {children}
        </Box>
    );
};
