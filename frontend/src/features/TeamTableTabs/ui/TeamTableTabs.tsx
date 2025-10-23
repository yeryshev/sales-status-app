import { memo, SyntheticEvent } from 'react';
import { TabItem, Tabs } from '@/shared/ui/Tabs';
import { Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';

interface ArticleTypeTabsProps {
  tabNumber: number;
  handleChangeTab: (event: SyntheticEvent, newTab: number) => void;
}

export const TeamTableTabs = memo((props: ArticleTypeTabsProps) => {
  const { handleChangeTab, tabNumber } = props;

  const teamTableTabs: TabItem[] = [
    {
      label: 'Команда',
    },
    {
      label: (
        <Tooltip
          title={
            <Typography variant={'inherit'}>
              Конные бега - визуализация соревнования менеджеров
              <br />
              Позиция коня зависит от текущей фактической выручки
            </Typography>
          }
        >
          <Typography variant={'inherit'}>Соревнование</Typography>
        </Tooltip>
      ),
    },
    {
      label: (
        <Tooltip
          title={
            <Typography variant={'inherit'}>
              Рейтинг менеджеров по новым клиентам
              <br />
              ТОП 3 получают бейджи каждую неделю
            </Typography>
          }
        >
          <Typography variant={'inherit'}>Успехи</Typography>
        </Tooltip>
      ),
    },
    {
      label: (
        <Tooltip
          title={
            <Typography variant={'inherit'}>
              График количества полученных лидов по менеджерам
              <br />
              Данные по месяцам с разбивкой по менеджерам
            </Typography>
          }
        >
          <Typography variant={'inherit'}>Отчет</Typography>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <Tabs tabs={teamTableTabs} tabNumber={tabNumber} handleChangeTab={handleChangeTab} />
    </Box>
  );
});
