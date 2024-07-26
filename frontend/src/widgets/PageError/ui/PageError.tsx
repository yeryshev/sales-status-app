import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './PageError.module.scss';
import { Button, Typography } from '@mui/material';

export const PageError = () => {
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className={classNames(cls.PageError, {}, [])}>
      <Typography variant="h6">Произошла непредвиденная ошибка</Typography>
      <Button onClick={reloadPage}>Обновить страницу</Button>
    </div>
  );
};
