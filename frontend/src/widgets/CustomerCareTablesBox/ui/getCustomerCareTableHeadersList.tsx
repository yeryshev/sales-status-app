import { TableCellProps, TooltipProps } from '@mui/material';
import { ReactElement } from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export type CustomerCareTableHeaderItemType = {
  align?: TableCellProps['align'];
  title?: TooltipProps['title'];
  content?: ReactElement<HTMLElement>;
};

export const getCustomerCareTableHeadersList = (shouldSeeHeroRow: boolean): CustomerCareTableHeaderItemType[] => {
  return [
    {},
    {
      align: 'left',
    },
    {
      align: 'left',
    },
    {
      align: 'left',
    },
    {
      align: 'center',
      title: shouldSeeHeroRow ? 'Работаю из дома' : '',
      content: shouldSeeHeroRow ? <HomeOutlinedIcon fontSize={'small'} /> : <></>,
    },
  ];
};
