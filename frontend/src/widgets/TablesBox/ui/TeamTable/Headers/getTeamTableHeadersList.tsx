import { TableCellProps, TooltipProps } from '@mui/material';
import { ReactElement } from 'react';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export type TeamTableHeaderItemType = {
  align?: TableCellProps['align'];
  title?: TooltipProps['title'];
  content?: ReactElement<HTMLElement>;
};

export const getTeamTableHeadersList = (shouldSeeHeroRow: boolean): TeamTableHeaderItemType[] => {
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
      title: 'Первичные обращения',
      content: <RequestQuoteOutlinedIcon fontSize={'small'} />,
    },
    {
      align: 'center',
      title: 'Просроченные задачи',
      content: <HourglassBottomOutlinedIcon fontSize={'small'} />,
    },
    {
      align: 'center',
      title: 'Количество открытых чатов',
      content: <QuestionAnswerOutlinedIcon fontSize={'small'} />,
    },
    {
      align: 'center',
      title: 'Назначенные тикеты',
      content: <FeedbackOutlinedIcon fontSize={'small'} />,
    },
    {
      align: 'center',
      title: shouldSeeHeroRow ? 'Работаю из дома' : '',
      content: shouldSeeHeroRow ? <HomeOutlinedIcon fontSize={'small'} /> : <></>,
    },
  ];
};
