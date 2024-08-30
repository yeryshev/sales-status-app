import { useEffect, useState } from 'react';
import { checkDeadlines, getDeadlineNumbersObject } from '../lib/deadlineHelpers';
import { User } from '@/entities/User';

export const useDeadlinesCheck = (teamList: User[], teamIsLoading: boolean) => {
  const [deadlines, setDeadlines] = useState<Record<User['id'], boolean>>({});

  useEffect(() => {
    if (!teamIsLoading && teamList.length > 0) {
      const deadlinesNumbersObject = getDeadlineNumbersObject(teamList);
      const isDeadlineReachedObject = checkDeadlines(deadlinesNumbersObject);
      setDeadlines(isDeadlineReachedObject);

      const checkDeadlinesInterval = setInterval(() => {
        const isDeadlineReachedObject = checkDeadlines(deadlinesNumbersObject);
        setDeadlines(isDeadlineReachedObject);
      }, 30000);

      return () => clearInterval(checkDeadlinesInterval);
    }
  }, [teamIsLoading, teamList]);

  return deadlines;
};
