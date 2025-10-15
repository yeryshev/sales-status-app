import { ChangeEvent } from 'react';
import { Skeleton, Switch } from '@mui/material';
import { StatusSelector } from '@/features/StatusSelector';
import { AvatarCell, UserNameCell, HeroCommentCell, CELL_WIDTHS, TeamRowCell, HeroRowProps } from '@/widgets/TablesBox';

interface CustomerCareHeroRowCellsListProps extends HeroRowProps {
  handleSwitch: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const CustomerCareHeroRowCellsList = (props: CustomerCareHeroRowCellsListProps): TeamRowCell[] => {
  const { teammate, teamIsLoading, additionalUserData, isDeadlineReached, handleSwitch } = props;

  const { avatar } = additionalUserData ?? {};

  return [
    {
      align: 'left',
      width: CELL_WIDTHS.AVATAR,
      content: <AvatarCell teammate={teammate} avatar={avatar} />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.USER_NAME,
      content: <UserNameCell teammate={teammate} />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.STATUS,
      content: teamIsLoading ? <Skeleton variant="text" /> : <StatusSelector />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.COMMENT,
      content: (
        <HeroCommentCell teammate={teammate} teamIsLoading={teamIsLoading} isDeadlineReached={isDeadlineReached} />
      ),
    },
    {
      align: 'center',
      width: CELL_WIDTHS.ARROW_DOWN,
      content: (
        <Switch
          id="customer-care-is-working-remotely-switch"
          name="isWorkingRemotely"
          checked={teammate.isWorkingRemotely}
          size={'small'}
          onChange={handleSwitch}
        />
      ),
    },
  ];
};
