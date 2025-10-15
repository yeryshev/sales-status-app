import { memo, SyntheticEvent } from 'react';
import { TabItem, Tabs } from '@/shared/ui/Tabs';
import Box from '@mui/system/Box';

interface CustomerCareTeamTableTabsProps {
  tabNumber: number;
  handleChangeTab: (event: SyntheticEvent, newTab: number) => void;
}

export const CustomerCareTeamTableTabs = memo((props: CustomerCareTeamTableTabsProps) => {
  const { handleChangeTab, tabNumber } = props;

  const customerCareTeamTableTabs: TabItem[] = [
    {
      label: 'Команда',
    },
  ];

  return (
    <Box>
      <Tabs tabs={customerCareTeamTableTabs} tabNumber={tabNumber} handleChangeTab={handleChangeTab} />
    </Box>
  );
});
