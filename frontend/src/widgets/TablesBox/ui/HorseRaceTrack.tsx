import { memo, useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';
import { formatValue } from '@/shared/lib/formatValue';
import { HorseIcon } from './HorseIcon';

interface HorseRaceTrackProps {
  teamList: User[];
  additionalTeamData: AdditionalUserData[];
  isAccountManagersRoute?: boolean;
}

interface HorseData {
  id: number;
  name: string;
  avatar: string;
  factRevenue: number;
  forecastRevenue: number;
  position: number;
  color: string;
  horseName: string;
  variant: number;
}

const horseColors = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#9C27B0', // Purple
  '#FF9800', // Orange
  '#F44336', // Red
  '#00BCD4', // Cyan
  '#E91E63', // Pink
  '#795548', // Brown
  '#607D8B', // Blue Grey
  '#FFC107', // Amber
  '#8BC34A', // Light Green
  '#FF5722', // Deep Orange
  '#3F51B5', // Indigo
  '#009688', // Teal
];

const horseNames = [
  'SPRINT STAR',
  'TURBO KING',
  'FLASH PRINCE',
  'GALLOP LEGEND',
  'WIND CHASER',
  'GAL OP CHASER',
  'SPEED DEMON',
  'RACING QUEEN',
  'THUNDER BOLT',
  'LIGHTNING FAST',
  'STORM RUNNER',
  'VICTORY RACE',
  'CHAMPION RUN',
  'GOLDEN HORSE',
  'SILVER STREAK',
];

export const HorseRaceTrack = memo((props: HorseRaceTrackProps) => {
  const { teamList, additionalTeamData } = props;

  const horsesData = useMemo(() => {
    // Создаем мапу для связи пользователей с дополнительными данными
    const additionalDataMap = new Map<number, AdditionalUserData>();
    additionalTeamData.forEach((data) => {
      additionalDataMap.set(data.idInside, data);
    });

    // Фильтруем менеджеров (исключаем координаторов)
    const managers = teamList.filter((user) => !user.isCoordinator);

    // Создаем данные для лошадей
    const horses: HorseData[] = managers.map((user, index) => {
      const additionalData = additionalDataMap.get(user.insideId);
      const qlik = additionalData?.qlik;

      const factRevenue = qlik?.factWithK ? parseFloat(qlik.factWithK) : 0;
      const forecastRevenue = qlik?.forecastWithK ? parseFloat(qlik.forecastWithK) : 0;

      return {
        id: user.id,
        name: `${user.firstName} ${user.secondName}`,
        avatar: additionalData?.avatar || '',
        factRevenue,
        forecastRevenue,
        position: 0, // Будет рассчитано ниже
        color: horseColors[index % horseColors.length],
        horseName: horseNames[index % horseNames.length],
        variant: index % 5, // 5 различных вариантов лошадей
      };
    });

    // Сортируем по фактической выручке (по убыванию)
    horses.sort((a, b) => b.factRevenue - a.factRevenue);

    // Устанавливаем позиции
    horses.forEach((horse, index) => {
      horse.position = index;
    });

    return horses;
  }, [teamList, additionalTeamData]);

  const maxRevenue = Math.max(...horsesData.map((horse) => horse.factRevenue));
  const trackWidth = 800;
  const trackHeight = 100;

  return (
    <Box sx={{ width: '100%', maxWidth: trackWidth + 200, mx: 'auto' }}>
      {/* Заголовок трека */}
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          🏁 Финишная прямая
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Максимальная выручка: {formatValue(maxRevenue.toString())}
        </Typography>
      </Box>

      {/* Трек */}
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          width: trackWidth,
          height: trackHeight * horsesData.length + 40,
          background: 'linear-gradient(90deg, #8B4513 0%, #D2691E 50%, #8B4513 100%)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Линии трека */}
        {horsesData.map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: index * trackHeight + trackHeight / 2,
              left: 0,
              right: 0,
              height: 2,
              background: 'rgba(255, 255, 255, 0.3)',
              zIndex: 1,
            }}
          />
        ))}

        {/* Финишная черта */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 4,
            height: '100%',
            background: 'repeating-linear-gradient(0deg, #000 0px, #000 10px, #fff 10px, #fff 20px)',
            zIndex: 2,
          }}
        />

        {/* Лошади */}
        {horsesData.map((horse, index) => {
          const progress = maxRevenue > 0 ? (horse.factRevenue / maxRevenue) * 100 : 0;
          const leftPosition = (progress / 100) * (trackWidth - 280); // 280px - ширина лошади + информационного блока

          return (
            <Box
              key={horse.id}
              sx={{
                position: 'absolute',
                top: index * trackHeight + 10,
                left: Math.max(10, leftPosition),
                zIndex: 3,
                transition: 'left 0.5s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {/* Иконка лошади - отдельно от информационного блока */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${horse.color}30, ${horse.color}60)`,
                  border: `4px solid ${horse.color}`,
                  boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                  position: 'relative',
                }}
              >
                <HorseIcon color={horse.color} size={65} variant={horse.variant} />

                {/* Позиция на иконке лошади */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    background: index < 3 ? '#FFD700' : index < 6 ? '#C0C0C0' : '#CD7F32',
                    color: index < 3 ? '#000' : '#fff',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
                    border: '3px solid white',
                  }}
                >
                  {index < 3 ? '🥇🥈🥉'[index] : index + 1}
                </Box>
              </Box>

              {/* Информационный блок - отдельно от иконки */}
              <Box
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 3,
                  p: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: 200,
                  border: `2px solid ${horse.color}`,
                  position: 'relative',
                }}
              >
                {/* Название лошади */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    color: horse.color,
                    mb: 1,
                    textAlign: 'center',
                  }}
                >
                  {horse.horseName}
                </Typography>

                {/* Фактическая выручка */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'success.main',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    mb: 0.5,
                  }}
                >
                  {formatValue(horse.factRevenue.toString())}
                </Typography>

                {/* Прогноз */}
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    display: 'block',
                  }}
                >
                  прогноз {formatValue(horse.forecastRevenue.toString())}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Paper>

      {/* Легенда */}
      <Box sx={{ mt: 3, p: 2, background: 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
          📊 Легенда:
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          • Зеленые цифры - фактическая выручка
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          • Серые цифры - прогноз на месяц
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          • Позиция лошади зависит от текущей выручки
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          • 🥇🥈🥉 - ТОП 3 получают золотые/серебряные медали
        </Typography>
      </Box>
    </Box>
  );
});
