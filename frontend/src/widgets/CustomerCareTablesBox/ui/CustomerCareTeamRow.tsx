import { memo, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { AdditionalUserData } from '@/entities/Team';
import { User } from '@/entities/User';
import { CustomerCareTeamRowCellsList } from './CustomerCareTeamRowCellsList';
import { ExpandRow } from '@/widgets/TablesBox';

export interface CustomerCareTeamRowProps {
  teammate: User;
  teamIsLoading: boolean;
  additionalUserData: AdditionalUserData;
  isDeadlineReached: boolean;
}

export const CustomerCareTeamRow = memo((props: CustomerCareTeamRowProps) => {
  const { teammate, teamIsLoading, additionalUserData, isDeadlineReached } = props;
  const [expandRow, setExpandRow] = useState(false);

  const exampleProps = {
    teammate,
    teamIsLoading,
    additionalUserData,
    isDeadlineReached,
    expandRow,
    setExpandRow,
    isAccountManagersRoute: false,
  };

  const teamRowCells = CustomerCareTeamRowCellsList(exampleProps);

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
