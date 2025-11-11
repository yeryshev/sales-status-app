// CustomerCareTablesBox — аналог TablesBox, но для customer care (isCcManager)
import { memo } from 'react';
import { useSelector } from 'react-redux';

import { Helmet } from 'react-helmet';
import Box from '@mui/system/Box';

import { getCustomerCareTeamList, getTeamIsLoading, useGetAdditionalTeamData } from '@/entities/Team';

import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { teamReducer } from '@/entities/Team';
import { WebSocketStatus } from '@/shared/ui/WebSocketStatus/WebSocketStatus';
import { CustomerCareTeamTableTabs } from './CustomerCareTeamTableTabs';

import { useTablesBoxViewModel } from '@/widgets/TablesBox';
import { CustomerCareTeamTableContainer } from './CustomerCareTeamTableContainer';

const reducers: ReducersList = {
  teamTable: teamReducer,
};

export const CustomerCareTablesBox = memo(() => {
  const teamIsLoading = useSelector(getTeamIsLoading);
  const customerCareTeamList = useSelector(getCustomerCareTeamList);
  const teamList = customerCareTeamList;

  const { data: additionalTeamData = [] } = useGetAdditionalTeamData();

  const { tabNumber, handleChangeTab, deadlines, websocketState } = useTablesBoxViewModel(teamList, teamIsLoading);

  return (
    <DynamicModuleLoader reducers={reducers}>
      <Helmet>
        <title>Customer Care</title>
      </Helmet>

      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <CustomerCareTeamTableTabs tabNumber={tabNumber} handleChangeTab={handleChangeTab} />
          <Box sx={{ minWidth: 150, display: 'flex', justifyContent: 'flex-end' }}>
            <WebSocketStatus {...websocketState} maxReconnectAttempts={5} />
          </Box>
        </Box>

        <CustomerCareTeamTableContainer
          active={tabNumber === 0}
          teamList={teamList}
          teamIsLoading={teamIsLoading}
          additionalTeamData={additionalTeamData}
          deadlines={deadlines}
        />
      </Box>
    </DynamicModuleLoader>
  );
});
