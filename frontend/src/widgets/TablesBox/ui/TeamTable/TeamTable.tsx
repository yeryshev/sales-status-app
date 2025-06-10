import { memo } from 'react';
import { Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { RowSkeleton } from '../RowSkeleton/RowSkeleton';
import { HeroRow } from './HeroRow/HeroRow';
import { TeamTableHeaderItem } from './Headers/TeamTableHeaderItem';
import { TeamTableProps } from './types';
import { DEFAULT_SKELETON_COUNT } from './constants';
import { useTeamTable } from './hooks/useTeamTable';
import { SeparatorRow } from './SeparatorRow';
import { TeamSection } from './TeamSection';
import { createSkeletons } from '../../lib/teamDataHelpers';

export const TeamTable = memo((props: TeamTableProps) => {
  const { teamIsLoading } = props;

  const { managers, coordinators, heroMember, headers, hasCoordinators, hasManagers, teamListIsNotEmpty } =
    useTeamTable(props);

  const skeletonKeys = createSkeletons(DEFAULT_SKELETON_COUNT);

  return (
    <TableContainer style={{ overflowX: 'auto' }} component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TeamTableHeaderItem key={index} item={header} />
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {/* Hero Row Section */}
          {heroMember && (
            <>
              <HeroRow
                teammate={heroMember.user}
                additionalUserData={heroMember.additionalData}
                teamIsLoading={teamIsLoading}
                isDeadlineReached={heroMember.isDeadlineReached}
                isAccountManagersRoute={props.isAccountManagersRoute}
              />
              <SeparatorRow colSpan={headers.length} />
            </>
          )}

          {/* Managers Section */}
          {teamListIsNotEmpty && hasManagers && (
            <TeamSection
              members={managers}
              isAccountManagersRoute={props.isAccountManagersRoute}
              teamIsLoading={teamIsLoading}
            />
          )}

          {/* Coordinators Section */}
          {hasCoordinators && (
            <>
              <SeparatorRow colSpan={headers.length} />
              <TeamSection
                members={coordinators}
                isAccountManagersRoute={props.isAccountManagersRoute}
                teamIsLoading={teamIsLoading}
              />
            </>
          )}

          {/* Loading Skeletons */}
          {teamIsLoading && skeletonKeys.map((key) => <RowSkeleton key={key} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
});
