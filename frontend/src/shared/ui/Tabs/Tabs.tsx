import { memo, ReactNode, SyntheticEvent } from 'react';
import { Tabs as MuiTabs } from '@mui/material';
import Tab from '@mui/material/Tab';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export interface TabItem {
  label: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  tabNumber: number;
  handleChangeTab: (event: SyntheticEvent, newTab: number) => void;
}

export const Tabs = memo((props: TabsProps) => {
  const { tabs, handleChangeTab, tabNumber } = props;

  return (
    <MuiTabs value={tabNumber} onChange={handleChangeTab} aria-label="basic tabs">
      {tabs.map((tab, index) => (
        <Tab key={index} label={tab.label} {...a11yProps(index)}></Tab>
      ))}
    </MuiTabs>
  );
});
