import { memo, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Skeleton,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import { CheckCircle, Cancel, TrendingUp, FiberManualRecord, Edit } from '@mui/icons-material';
import {
  useGetTextReportQuery,
  useUpdateTextReportMutation,
  useCreateTextReportMutation,
} from '../../api/textReportApi';
import { getUserData } from '@/entities/User';

interface TextReportCardProps {
  year: number;
  month: number;
  department: 'inbound' | 'account';
}

const reportTypeConfig = {
  done: {
    label: 'Что сделано',
    icon: <CheckCircle />,
    color: 'success' as const,
  },
  notDone: {
    label: 'Что не сделано',
    icon: <Cancel />,
    color: 'error' as const,
  },
  plans: {
    label: 'Планы на следующий месяц',
    icon: <TrendingUp />,
    color: 'primary' as const,
  },
};

// Функция для разбиения текста на строки и создания списка
const renderTextAsList = (text: string) => {
  const lines = text.split('\n').filter((line) => line.trim() !== '');

  if (lines.length === 1) {
    // Если только одна строка, отображаем как обычный текст
    return (
      <Typography
        variant="body2"
        sx={{
          lineHeight: 1.6,
          color: 'text.secondary',
        }}
      >
        {text}
      </Typography>
    );
  }

  // Если несколько строк, отображаем как список
  return (
    <List dense sx={{ py: 0 }}>
      {lines.map((line, index) => (
        <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
          <ListItemIcon sx={{ minWidth: 24 }}>
            <FiberManualRecord sx={{ fontSize: 8, color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText
            primary={line.trim()}
            primaryTypographyProps={{
              variant: 'body2',
              sx: {
                lineHeight: 1.6,
                color: 'text.secondary',
              },
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export const TextReportCard = memo((props: TextReportCardProps) => {
  const { year, month, department } = props;
  const user = useSelector(getUserData);
  const isSuperUser = user?.isSuperuser || false;
  const hasInsideId = user?.insideId && user.insideId > 0;

  // Проверяем, установлена ли переменная окружения
  const hasTextReportApiUrl = !!import.meta.env.VITE_TEXT_REPORT_URL;

  // Получаем данные для всех трех типов отчетов (всегда вызываем хуки)
  const {
    data: doneData,
    isLoading: doneLoading,
    error: doneError,
  } = useGetTextReportQuery(
    {
      year,
      month,
      department,
      type: 'done',
    },
    {
      skip: !hasTextReportApiUrl,
    },
  );

  const {
    data: notDoneData,
    isLoading: notDoneLoading,
    error: notDoneError,
  } = useGetTextReportQuery(
    {
      year,
      month,
      department,
      type: 'notDone',
    },
    {
      skip: !hasTextReportApiUrl,
    },
  );

  const {
    data: plansData,
    isLoading: plansLoading,
    error: plansError,
  } = useGetTextReportQuery(
    {
      year,
      month,
      department,
      type: 'plans',
    },
    {
      skip: !hasTextReportApiUrl,
    },
  );

  // Состояние для редактирования
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    done: '',
    notDone: '',
    plans: '',
  });

  // Refs для TextField компонентов
  const doneInputRef = useRef<HTMLDivElement>(null);
  const notDoneInputRef = useRef<HTMLDivElement>(null);
  const plansInputRef = useRef<HTMLDivElement>(null);
  const editDoneInputRef = useRef<HTMLDivElement>(null);
  const editNotDoneInputRef = useRef<HTMLDivElement>(null);
  const editPlansInputRef = useRef<HTMLDivElement>(null);

  // Функция для установки атрибутов на скрытые textarea элементы
  const setHiddenTextareaAttributes = useCallback(() => {
    const refs = [
      { ref: doneInputRef, name: 'text-report-done-input' },
      { ref: notDoneInputRef, name: 'text-report-not-done-input' },
      { ref: plansInputRef, name: 'text-report-plans-input' },
      { ref: editDoneInputRef, name: 'text-report-edit-done-input' },
      { ref: editNotDoneInputRef, name: 'text-report-edit-not-done-input' },
      { ref: editPlansInputRef, name: 'text-report-edit-plans-input' },
    ];

    refs.forEach(({ ref, name }) => {
      if (ref.current) {
        const hiddenTextarea = ref.current.querySelector('textarea[aria-hidden="true"]');
        if (hiddenTextarea) {
          hiddenTextarea.setAttribute('name', name);
        }
      }
    });
  }, []);

  // Устанавливаем атрибуты после рендера
  useEffect(() => {
    const timer = setTimeout(setHiddenTextareaAttributes, 0);
    return () => clearTimeout(timer);
  }, [setHiddenTextareaAttributes, isEditMode]);

  // Состояние для уведомлений
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Мутации для обновления и создания отчетов
  const [updateTextReport, { isLoading: isUpdating }] = useUpdateTextReportMutation();
  const [createTextReport, { isLoading: isCreating }] = useCreateTextReportMutation();

  // Все хуки должны быть вызваны до условных возвратов
  const isLoading = doneLoading || notDoneLoading || plansLoading;
  const hasError = doneError || notDoneError || plansError;

  // Проверяем, есть ли данные в отчетах (фильтруем пустые описания)
  const hasReports = useMemo(() => {
    const hasDoneReports =
      doneData && doneData.some((report) => report.description && report.description.trim() !== '');
    const hasNotDoneReports =
      notDoneData && notDoneData.some((report) => report.description && report.description.trim() !== '');
    const hasPlansReports =
      plansData && plansData.some((report) => report.description && report.description.trim() !== '');

    return hasDoneReports || hasNotDoneReports || hasPlansReports;
  }, [doneData, notDoneData, plansData]);

  // Проверяем, есть ли хотя бы один отчет (даже с пустым описанием) для показа кнопки редактирования
  const hasAnyReport = useMemo(() => {
    return (
      (doneData && doneData.length > 0) ||
      (notDoneData && notDoneData.length > 0) ||
      (plansData && plansData.length > 0)
    );
  }, [doneData, notDoneData, plansData]);

  // Получаем названия месяцев
  const monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  const monthName = monthNames[month - 1];

  // Функция для открытия режима редактирования
  const handleEditClick = useCallback(() => {
    // Заполняем форму текущими данными (если отчеты есть) или оставляем пустой (если отчетов нет)
    const formData = {
      done: doneData?.[0]?.description || '',
      notDone: notDoneData?.[0]?.description || '',
      plans: plansData?.[0]?.description || '',
    };
    setEditForm(formData);
    setIsEditMode(true);
  }, [doneData, notDoneData, plansData]);

  // Функция для сохранения изменений
  const handleSave = useCallback(async () => {
    // Дополнительная проверка на insideId
    if (!hasInsideId) {
      setNotification({
        open: true,
        message: 'Редактирование доступно только пользователям с заполненным inside ID',
        severity: 'error',
      });
      return;
    }

    try {
      let hasChanges = false;

      // Обновляем существующие отчеты
      if (doneData?.[0] && editForm.done.trim() !== '') {
        const result = await updateTextReport({
          id: doneData[0].id,
          description: editForm.done.trim(),
        }).unwrap();
        if (result && result.length > 0) hasChanges = true;
      }
      if (notDoneData?.[0] && editForm.notDone.trim() !== '') {
        const result = await updateTextReport({
          id: notDoneData[0].id,
          description: editForm.notDone.trim(),
        }).unwrap();
        if (result && result.length > 0) hasChanges = true;
      }
      if (plansData?.[0] && editForm.plans.trim() !== '') {
        const result = await updateTextReport({
          id: plansData[0].id,
          description: editForm.plans.trim(),
        }).unwrap();
        if (result && result.length > 0) hasChanges = true;
      }

      // Создаем новые отчеты (когда исходных данных нет или они пустые)
      if ((!doneData || doneData.length === 0) && editForm.done.trim() !== '') {
        const result = await createTextReport({
          idInside: user!.insideId, // Уже проверено выше
          year,
          month,
          department,
          description: editForm.done.trim(),
          type: 'done',
        }).unwrap();
        if (result && result.length > 0) hasChanges = true;
      }
      if ((!notDoneData || notDoneData.length === 0) && editForm.notDone.trim() !== '') {
        const result = await createTextReport({
          idInside: user!.insideId, // Уже проверено выше
          year,
          month,
          department,
          description: editForm.notDone.trim(),
          type: 'notDone',
        }).unwrap();
        if (result && result.length > 0) hasChanges = true;
      }
      if ((!plansData || plansData.length === 0) && editForm.plans.trim() !== '') {
        const result = await createTextReport({
          idInside: user!.insideId, // Уже проверено выше
          year,
          month,
          department,
          description: editForm.plans.trim(),
          type: 'plans',
        }).unwrap();
        if (result && result.length > 0) hasChanges = true;
      }

      setIsEditMode(false);

      // Убираем фокус с кнопки после закрытия модального окна
      setTimeout(() => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }, 0);

      // Показываем уведомление об успехе
      if (hasChanges) {
        setNotification({
          open: true,
          message: 'Отчет успешно сохранен',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Ошибка при сохранении отчета:', error);
      setNotification({
        open: true,
        message: 'Ошибка при сохранении отчета',
        severity: 'error',
      });
    }
  }, [
    doneData,
    notDoneData,
    plansData,
    editForm,
    updateTextReport,
    createTextReport,
    hasInsideId,
    user,
    year,
    month,
    department,
  ]);

  // Функция для отмены редактирования
  const handleCancel = useCallback(() => {
    setIsEditMode(false);
    setEditForm({ done: '', notDone: '', plans: '' });

    // Убираем фокус с кнопки после закрытия модального окна
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.blur) {
        activeElement.blur();
      }
    }, 0);
  }, []);

  // Функция для закрытия уведомления
  const handleCloseNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  if (!hasTextReportApiUrl) {
    return (
      <>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Текстовый отчет
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Для отображения текстового отчета необходимо установить переменную окружения VITE_TEXT_REPORT_URL
            </Typography>
          </CardContent>
        </Card>

        {/* Уведомления - вынесены за пределы Card */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            position: 'fixed',
            zIndex: 9999,
            '& .MuiSnackbar-root': {
              position: 'fixed',
            },
          }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Текстовый отчет
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3].map((i) => (
                <Box key={i}>
                  <Skeleton variant="text" width="30%" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={100} />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Уведомления - вынесены за пределы Card */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            position: 'fixed',
            zIndex: 9999,
            '& .MuiSnackbar-root': {
              position: 'fixed',
            },
          }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  if (hasError) {
    return (
      <>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Текстовый отчет
            </Typography>
            <Alert severity="error">Ошибка загрузки текстового отчета. Попробуйте позже.</Alert>
          </CardContent>
        </Card>

        {/* Уведомления - вынесены за пределы Card */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            position: 'fixed',
            zIndex: 9999,
            '& .MuiSnackbar-root': {
              position: 'fixed',
            },
          }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  if (!hasReports) {
    return (
      <>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Текстовый отчет</Typography>
              {isSuperUser && hasInsideId && (
                <Button variant="outlined" size="small" startIcon={<Edit />} onClick={handleEditClick}>
                  Добавить отчет
                </Button>
              )}
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Отчет за {monthName} {year} не заполнен
            </Typography>
          </CardContent>

          {/* Диалог редактирования */}
          <Dialog open={isEditMode} onClose={handleCancel} maxWidth="md" fullWidth disableRestoreFocus>
            <DialogTitle>Добавление текстового отчета</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                <TextField
                  ref={editDoneInputRef}
                  id="text-report-edit-done"
                  label="Что сделано"
                  multiline
                  rows={4}
                  value={editForm.done}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, done: e.target.value }))}
                  placeholder="Опишите, что было сделано за месяц..."
                  inputProps={{
                    name: 'text-report-edit-done-input',
                  }}
                />
                <TextField
                  ref={editNotDoneInputRef}
                  id="text-report-edit-not-done"
                  label="Что не сделано"
                  multiline
                  rows={4}
                  value={editForm.notDone}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, notDone: e.target.value }))}
                  placeholder="Опишите, что не удалось сделать за месяц..."
                  inputProps={{
                    name: 'text-report-edit-not-done-input',
                  }}
                />
                <TextField
                  ref={editPlansInputRef}
                  id="text-report-edit-plans"
                  label="Планы на следующий месяц"
                  multiline
                  rows={4}
                  value={editForm.plans}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, plans: e.target.value }))}
                  placeholder="Опишите планы на следующий месяц..."
                  inputProps={{
                    name: 'text-report-edit-plans-input',
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel} disabled={isUpdating || isCreating}>
                Отмена
              </Button>
              <Button onClick={handleSave} variant="contained" disabled={isUpdating || isCreating}>
                {isUpdating || isCreating ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </DialogActions>
          </Dialog>
        </Card>

        {/* Уведомления - вынесены за пределы Card */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            position: 'fixed',
            zIndex: 9999,
            '& .MuiSnackbar-root': {
              position: 'fixed',
            },
          }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Текстовый отчет</Typography>
            {isSuperUser && hasInsideId && hasAnyReport && (
              <Button variant="outlined" size="small" startIcon={<Edit />} onClick={handleEditClick}>
                Редактировать
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {Object.entries(reportTypeConfig).map(([type, config]) => {
              const data = type === 'done' ? doneData : type === 'notDone' ? notDoneData : plansData;

              // Фильтруем отчеты с пустым описанием
              const filteredData = data?.filter((report) => report.description && report.description.trim() !== '');

              if (!filteredData || filteredData.length === 0) {
                return null;
              }

              return (
                <Box key={type}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      icon={config.icon}
                      label={config.label}
                      color={config.color}
                      variant="outlined"
                      size="medium"
                    />
                  </Box>
                  <Box sx={{ pl: 2 }}>
                    {filteredData.map((report) => (
                      <Box key={report.id}>{renderTextAsList(report.description)}</Box>
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </CardContent>

        {/* Диалог редактирования */}
        <Dialog open={isEditMode} onClose={handleCancel} maxWidth="md" fullWidth disableRestoreFocus>
          <DialogTitle>Редактирование текстового отчета</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField
                ref={doneInputRef}
                id="text-report-done"
                label="Что сделано"
                multiline
                rows={4}
                value={editForm.done}
                onChange={(e) => setEditForm((prev) => ({ ...prev, done: e.target.value }))}
                placeholder="Опишите, что было сделано за месяц..."
                inputProps={{
                  name: 'text-report-done-input',
                }}
              />
              <TextField
                ref={notDoneInputRef}
                id="text-report-not-done"
                label="Что не сделано"
                multiline
                rows={4}
                value={editForm.notDone}
                onChange={(e) => setEditForm((prev) => ({ ...prev, notDone: e.target.value }))}
                placeholder="Опишите, что не удалось сделать за месяц..."
                inputProps={{
                  name: 'text-report-not-done-input',
                }}
              />
              <TextField
                ref={plansInputRef}
                id="text-report-plans"
                label="Планы на следующий месяц"
                multiline
                rows={4}
                value={editForm.plans}
                onChange={(e) => setEditForm((prev) => ({ ...prev, plans: e.target.value }))}
                placeholder="Опишите планы на следующий месяц..."
                inputProps={{
                  name: 'text-report-plans-input',
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} disabled={isUpdating || isCreating}>
              Отмена
            </Button>
            <Button onClick={handleSave} variant="contained" disabled={isUpdating || isCreating}>
              {isUpdating || isCreating ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>

      {/* Уведомления - вынесены за пределы Card */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          position: 'fixed',
          zIndex: 9999,
          '& .MuiSnackbar-root': {
            position: 'fixed',
          },
        }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
});
