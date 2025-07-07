import { AdditionalUserData } from '@/entities/Team';
import { User } from '@/entities/User';

export const getTotalBudget = (
  managers: Array<User>,
  additionalUsersData: Array<AdditionalUserData>,
  isCurrentWeek: boolean,
) => {
  const totalBudget = managers.reduce((acc, manager) => {
    const dataOfManager = additionalUsersData.find((userData) => userData.idInside === manager.insideId);
    const budgetOfCurrentWeek = Number(dataOfManager?.budget.newSaleAndUpsale) || 0;
    const budgetOfLastWeek = Number(dataOfManager?.lastWeek.budget) || 0;
    return isCurrentWeek ? acc + budgetOfCurrentWeek : acc + budgetOfLastWeek;
  }, 0);

  return totalBudget.toLocaleString('ru-RU');
};
