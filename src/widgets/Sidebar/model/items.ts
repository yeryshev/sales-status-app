import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';

export type SidebarItemType = {
  path: string;
  text: string;
  Icon: OverridableComponent<SvgIconTypeMap>;
};

export const SidebarItemsList: Array<SidebarItemType> = [
  {
    path: RoutePath.main,
    text: 'Дашборд',
    Icon: DashboardIcon,
  },
  {
    path: RoutePath.profile,
    text: 'Профиль',
    Icon: AccountBoxIcon,
  },
];
