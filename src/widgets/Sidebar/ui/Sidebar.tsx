import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import { NavbarItems } from './SidebarItems'
import { memo } from 'react'

interface SidebarProps {
  sideBarOpen: boolean
  toggleSideBar: () => () => void
}

export const Sidebar = memo(({ sideBarOpen, toggleSideBar }: SidebarProps) => {
    return (
        <Drawer open={sideBarOpen} onClose={toggleSideBar()}>
            <Box
                component="nav"
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleSideBar()}
                onKeyDown={toggleSideBar()}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1]
                    }}
                >
                    <IconButton onClick={toggleSideBar}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <NavbarItems />
                </List>
            </Box>
        </Drawer>
    )
})
