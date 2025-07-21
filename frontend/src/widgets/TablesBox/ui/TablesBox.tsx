import { memo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Box from '@mui/system/Box';

import {
  getAccountManagerTeamList,
  getInboundTeamList,
  getTeamIsLoading,
  useGetAdditionalTeamData,
} from '@/entities/Team';
import { AppRoutes, RoutePath } from '@/shared/const/router';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { teamReducer } from '@/entities/Team';
import { WebSocketStatus } from '@/shared/ui/WebSocketStatus/WebSocketStatus';
import { TeamTableTabs } from '@/features/TeamTableTabs';

import { useTablesBoxViewModel } from '../hooks/useTablesBoxViewModel';
import { TeamTableContainer } from './TeamTableContainer';
import { TeamResultsContainer } from './TeamResultsContainer';
import { MonthlyReportContainer } from './MonthlyReportContainer';

const reducers: ReducersList = {
  teamTable: teamReducer,
};

export const TablesBox = memo(() => {
  const location = useLocation();
  const isAccountManagersRoute = location.pathname === RoutePath[AppRoutes.ACCOUNT_MANAGERS];

  const teamIsLoading = useSelector(getTeamIsLoading);
  const inboundTeamList = useSelector(getInboundTeamList);
  const accountManagerTeamList = useSelector(getAccountManagerTeamList);
  const teamList = isAccountManagersRoute ? accountManagerTeamList : inboundTeamList;

  const { data: additionalTeamData = [] } = useGetAdditionalTeamData(undefined, {
    skip: !import.meta.env.VITE_EXTERNAL_API_URL,
  });

  const { tabNumber, handleChangeTab, deadlines, websocketState } = useTablesBoxViewModel(teamList, teamIsLoading);

  return (
    <DynamicModuleLoader reducers={reducers}>
      <Helmet>
        <title>{isAccountManagersRoute ? 'Аккаунт менеджеры' : 'Входящие'}</title>
      </Helmet>

      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TeamTableTabs tabNumber={tabNumber} handleChangeTab={handleChangeTab} />
          <Box sx={{ minWidth: 150, display: 'flex', justifyContent: 'flex-end' }}>
            <WebSocketStatus {...websocketState} maxReconnectAttempts={5} />
          </Box>
        </Box>

        <TeamTableContainer
          active={tabNumber === 0}
          teamList={teamList}
          teamIsLoading={teamIsLoading}
          additionalTeamData={additionalTeamData}
          deadlines={deadlines}
          isAccountManagersRoute={isAccountManagersRoute}
        />

        <TeamResultsContainer
          active={tabNumber === 1}
          teamList={teamList}
          teamIsLoading={teamIsLoading}
          additionalTeamData={additionalTeamData}
          isAccountManagersRoute={isAccountManagersRoute}
        />

        <MonthlyReportContainer active={tabNumber === 2} />
      </Box>
    </DynamicModuleLoader>
  );
});
