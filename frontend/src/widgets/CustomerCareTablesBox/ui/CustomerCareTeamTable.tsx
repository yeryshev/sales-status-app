import { memo } from 'react';
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper } from '@mui/material';
import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';
import { CustomerCareTeamTableHeaderItem } from './CustomerCareTeamTableHeaderItem';
import { CustomerCareHeroRow } from './CustomerCareHeroRow';

import { SeparatorRow } from '@/widgets/TablesBox';
import { CustomerCareTeamSection } from './CustomerCareTeamSection';
import { CustomerCareRowSkeleton } from './CustomerCareRowSkeleton';
import { useCustomerCareTeamTable } from '../hooks/useCustomerCareTeamTable';

export interface CustomerCareTeamTableProps {
  teamList: User[];
  teamIsLoading: boolean;
  isDeadlineReachedObject: Record<User['id'], boolean>;
  additionalTeamData: Array<AdditionalUserData>;
}

export const CustomerCareTeamTable = memo((props: CustomerCareTeamTableProps) => {
  const { teamList, teamIsLoading, isDeadlineReachedObject, additionalTeamData } = props;

  const { managers, heroMember, headers, hasManagers, teamListIsNotEmpty } = useCustomerCareTeamTable({
    teamList,
    teamIsLoading,
    isDeadlineReachedObject,
    additionalTeamData,
  });

  const skeletonKeys = Array.from({ length: 5 }, (_, index) => index);

  return (
    <TableContainer style={{ overflowX: 'auto' }} component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <CustomerCareTeamTableHeaderItem key={index} item={header} />
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {/* Hero Row Section */}
          {heroMember && (
            <>
              <CustomerCareHeroRow
                teammate={heroMember.user}
                additionalUserData={heroMember.additionalData}
                teamIsLoading={teamIsLoading}
                isDeadlineReached={heroMember.isDeadlineReached}
              />
              <SeparatorRow colSpan={headers.length} />
            </>
          )}

          {/* Managers Section */}
          {teamListIsNotEmpty && hasManagers && (
            <CustomerCareTeamSection members={managers} teamIsLoading={teamIsLoading} />
          )}

          {/* Loading Skeletons */}
          {teamIsLoading && skeletonKeys.map((key) => <CustomerCareRowSkeleton key={key} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
});
