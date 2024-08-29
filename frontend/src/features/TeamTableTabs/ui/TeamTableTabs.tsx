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
  ];

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs tabs={teamTableTabs} tabNumber={tabNumber} handleChangeTab={handleChangeTab} />
    </Box>
  );
});
