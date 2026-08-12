import { memo } from 'react';
import { TeamRow } from './TeamRow/TeamRow';
import { TeamSectionProps } from './types';

export const TeamSection = memo((props: TeamSectionProps) => {
  const { members, isAccountManagersRoute, teamIsLoading, showLeadsSourceLost = false } = props;

  return (
    <>
      {members.map((member) => (
        <TeamRow
          key={member.user.id}
          teammate={member.user}
          additionalUserData={member.additionalData}
          isDeadlineReached={member.isDeadlineReached}
          teamIsLoading={teamIsLoading}
          isAccountManagersRoute={isAccountManagersRoute}
          showLeadsSourceLost={showLeadsSourceLost}
        />
      ))}
    </>
  );
});
