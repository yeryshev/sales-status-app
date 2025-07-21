import { TableCellProps } from '@mui/material';
import {
  TeamRowProps,
  TeamRowCell,
  AvatarCell,
  UserNameCell,
  StatusCell,
  CommentCell,
  ArrowDownCell,
  CELL_WIDTHS,
} from '@/widgets/TablesBox';
import { ReactNode, TdHTMLAttributes } from 'react';

export interface CustomerCareTeamRowCell {
  align: TableCellProps['align'];
  width?: TdHTMLAttributes<HTMLTableCellElement>['width'];
  content: ReactNode;
}

interface CustomerCareTeamRowCellsListProps extends TeamRowProps {
  expandRow: boolean;
  setExpandRow: (value: boolean) => void;
}

export const CustomerCareTeamRowCellsList = (props: CustomerCareTeamRowCellsListProps): TeamRowCell[] => {
  const { teammate, additionalUserData, isDeadlineReached, expandRow, setExpandRow } = props;

  const { avatar, absence, mangoState } = additionalUserData;

  return [
    {
      align: 'left',
      width: CELL_WIDTHS.AVATAR,
      content: <AvatarCell teammate={teammate} avatar={avatar} absence={absence} />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.USER_NAME,
      content: <UserNameCell teammate={teammate} absence={absence} />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.STATUS,
      content: (
        <StatusCell teammate={teammate} mango={mangoState} absence={absence} isDeadlineReached={isDeadlineReached} />
      ),
    },
    {
      align: 'left',
      width: CELL_WIDTHS.COMMENT,
      content: <CommentCell absence={absence} />,
    },
    {
      align: 'center',
      width: CELL_WIDTHS.ARROW_DOWN,
      content: <ArrowDownCell expandRow={expandRow} setExpandRow={setExpandRow} />,
    },
  ];
};
