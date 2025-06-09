import { memo, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { AdditionalUserData, Teammate } from '@/entities/Team';
import { TeamRowCellsList } from './TeamRowCellsList';
import { ExpandRow } from '../RowCells/ExpandRow';

export interface TeamRowProps {
  teammate: Teammate;
  teamIsLoading: boolean;
  additionalUserData: AdditionalUserData;
  isDeadlineReached: boolean;
  isAccountManagersRoute: boolean;
}

export const TeamRow = memo((props: TeamRowProps) => {
  const { teammate, teamIsLoading, additionalUserData, isDeadlineReached, isAccountManagersRoute } = props;
  const [expandRow, setExpandRow] = useState(false);

  const exampleProps = {
    teammate,
    teamIsLoading,
    additionalUserData,
    isDeadlineReached,
    isAccountManagersRoute,
    expandRow,
    setExpandRow,
  };

  const teamRowCells = TeamRowCellsList(exampleProps);

  return (
    <>
      {additionalUserData && (
        <>
          <TableRow hover={true}>
            {teamRowCells.map((cell, index) => (
              <TableCell key={index} align={cell.align} width={cell.width}>
                {cell.content}
              </TableCell>
            ))}
          </TableRow>
          <ExpandRow teammate={teammate} expandRow={expandRow} />
        </>
      )}
    </>
  );
});
