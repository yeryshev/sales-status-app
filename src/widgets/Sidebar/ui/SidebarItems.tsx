import { Link } from 'react-router-dom'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccountBoxIcon from '@mui/icons-material/AccountBox'

export const NavbarItems = () => {
    return (
        <>
            <ListItemButton component={Link} to="/">
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Дашборд" />
            </ListItemButton>
            <ListItemButton component={Link} to="/profile">
                <ListItemIcon>
                    <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Профиль" />
            </ListItemButton>
        </>
    )
}
