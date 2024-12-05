import { User } from '@/entities/User';
import moment from 'moment';

export const getDeadlineNumbersObject = (teamList: User[]) => {
  const deadlinesNumbersObject: Record<User['id'], number> = {};
  teamList.forEach((user) => {
    if (user.busyTime) {
      deadlinesNumbersObject[user.id] = moment.utc(user.busyTime.endTime).valueOf();
    }
  });

  return deadlinesNumbersObject;
};

export const checkDeadlines = (deadlinesNumbersObj: ReturnType<typeof getDeadlineNumbersObject>) => {
  const currentTimeUTC = moment().utc().valueOf();

  const deadlinesStatesObject: Record<User['id'], boolean> = {};
  for (const key in deadlinesNumbersObj) {
    deadlinesStatesObject[key] = currentTimeUTC >= deadlinesNumbersObj[key];
  }

  return deadlinesStatesObject;
};
