import { RoutePath } from '@/shared/const/router';

export type NavbarItemType = {
  path: string;
  text: string;
};

export const NavbarItemsList: Array<NavbarItemType> = [
  {
    path: import.meta.env.VITE_CONFLUENCE_URL + '/display/PRES/Inbound' || RoutePath.main,
    text: 'Confluence',
  },
  {
    path: import.meta.env.VITE_KP_GENERATOR_URL || RoutePath.main,
    text: 'KP Generator',
  },
];
