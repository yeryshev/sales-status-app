import { memo } from 'react';
import { CustomerCareTeamRow } from './CustomerCareTeamRow';
import { TeamMember } from '@/widgets/TablesBox';

export interface CustomerCareTeamSectionProps {
  members: TeamMember[];
  teamIsLoading: boolean;
}

export const CustomerCareTeamSection = memo((props: CustomerCareTeamSectionProps) => {
  const { members, teamIsLoading } = props;

  return (
    <>
      {members.map((member) => (
        <CustomerCareTeamRow
          key={member.user.id}
          teammate={member.user}
          additionalUserData={member.additionalData}
          isDeadlineReached={member.isDeadlineReached}
          teamIsLoading={teamIsLoading}
        />
      ))}
    </>
  );
});
