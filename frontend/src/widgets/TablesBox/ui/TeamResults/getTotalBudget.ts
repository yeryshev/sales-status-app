import { Teammate, UsersLastWeekStats, UsersTasks } from '@/entities/Team';

type Stats = UsersTasks | UsersLastWeekStats;

export const getTotalBudget = (teamList: Teammate[], stats: Stats) => {
  return teamList.reduce((acc, teammate) => {
    return acc + (Number(stats[teammate.insideId]?.budget) || 0);
  }, 0);
};
