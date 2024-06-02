import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentsIcon from '@mui/icons-material/Payments';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';

export type SidebarItemType = {
  path: string;
  text: string;
  Icon: OverridableComponent<SvgIconTypeMap>;
};

export const SidebarItemsList: Array<SidebarItemType> = [
  {
    path: RoutePath.main,
    text: 'Входящие',
    Icon: AttachMoneyIcon,
  },
  {
    path: RoutePath.accountManagers,
    text: 'Аккаунты',
    Icon: PaymentsIcon,
  },
  {
    path: RoutePath.profile,
    text: 'Профиль',
    Icon: AccountBoxIcon,
  },
];
