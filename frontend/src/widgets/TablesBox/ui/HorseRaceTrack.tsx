import { memo, useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';
import { formatValue } from '@/shared/lib/formatValue';
import { HorseIcon } from './HorseIcon';
import { getHorseIconVariant } from '@/shared/lib/utils/horseIconScanner';

interface HorseRaceTrackProps {
  teamList: User[];
  additionalTeamData: AdditionalUserData[];
  isAccountManagersRoute?: boolean;
}

interface HorseData {
  id: number;
  insideId: number; // Добавляем insideId для сопоставления с иконками
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

  // Создаем стабильный ключ для генерации случайного порядка
  const stableKey = useMemo(() => {
    return teamList
      .map((user) => user.id)
      .sort()
      .join('-');
  }, [teamList]);

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
        insideId: user.insideId, // Добавляем insideId для сопоставления с иконками
        name: `${user.firstName} ${user.secondName}`,
        avatar: additionalData?.avatar || '',
        factRevenue,
        forecastRevenue,
        position: 0, // Будет рассчитано ниже
        color: horseColors[index % horseColors.length],
        horseName: horseNames[index % horseNames.length],
        variant: 0, // Будет установлено после сортировки
      };
    });

    // Сортируем по фактической выручке (по убыванию) для горизонтального позиционирования
    horses.sort((a, b) => b.factRevenue - a.factRevenue);

    // Создаем стабильный случайный порядок на основе стабильного ключа
    const randomVerticalOrder = Array.from({ length: horses.length }, (_, i) => i);

    // Используем стабильный seed для генерации случайного порядка
    const seed = stableKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (index: number) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };

    for (let i = randomVerticalOrder.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(i) * (i + 1));
      [randomVerticalOrder[i], randomVerticalOrder[j]] = [randomVerticalOrder[j], randomVerticalOrder[i]];
    }

    // Устанавливаем позиции и варианты иконок
    horses.forEach((horse, index) => {
      horse.position = randomVerticalOrder[index]; // Случайная вертикальная позиция

      // Определяем variant с помощью утилиты
      horse.variant = getHorseIconVariant(horse.insideId, index, horses.length);
    });

    return horses;
  }, [teamList, additionalTeamData, stableKey]);

  const maxRevenue = Math.max(...horsesData.map((horse) => horse.factRevenue));
  const trackWidth = 800;
  const trackHeight = 100;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Трек */}
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          width: '100%',
          height: trackHeight * horsesData.length + 40,
          background: (theme) => `
            linear-gradient(90deg, ${theme.palette.mode === 'dark' ? '#8B4513' : '#D2B48C'} 0%, ${theme.palette.mode === 'dark' ? '#A0522D' : '#F4A460'} 50%, ${theme.palette.mode === 'dark' ? '#8B4513' : '#D2B48C'} 100%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)'} 10px,
              ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)'} 11px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 15px,
              ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)'} 15px,
              ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)'} 16px
            )
          `,
          backgroundSize: '100% 100%, 20px 20px, 30px 30px',
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
              background: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.3)',
              zIndex: 1,
            }}
          />
        ))}

        {/* Вертикальные линии для текстуры дорожки */}
        {Array.from({ length: 20 }, (_, i) => (
          <Box
            key={`vertical-${i}`}
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${i * 5 + 2}%`,
              width: '1px',
              background: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
              zIndex: 1,
            }}
          />
        ))}

        {/* Точечные узоры для текстуры */}
        {Array.from({ length: 120 }, (_, i) => {
          // Создаем очень плотное распределение
          const top = (i * 13 + i * i * 7) % 100;
          const left = (i * 17 + i * i * 11) % 100;
          const size = 3 + ((i * 7) % 8); // размеры от 3 до 10
          const opacity =
            i % 2 === 0
              ? 0.02 + ((i * 3) % 4) * 0.01 // светлые: 0.02-0.06
              : 0.06 + ((i * 5) % 8) * 0.01; // темные: 0.06-0.14

          return (
            <Box
              key={`dot-${i}`}
              sx={{
                position: 'absolute',
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: `rgba(0, 0, 0, ${opacity})`,
                borderRadius: '50%',
                zIndex: 1,
              }}
            />
          );
        })}

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
        {horsesData.map((horse) => {
          // Горизонтальное позиционирование по выручке (лидер впереди)
          const progress = maxRevenue > 0 ? (horse.factRevenue / maxRevenue) * 100 : 0;
          const leftPosition = (progress / 100) * (trackWidth - 280); // 280px - ширина лошади + информационного блока

          return (
            <Box
              key={horse.id}
              sx={{
                position: 'absolute',
                top: horse.position * trackHeight + 10, // Используем случайную вертикальную позицию
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
                  width: 180,
                  height: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HorseIcon color={horse.color} size={190} variant={horse.variant} />
              </Box>

              {/* Информационный блок - отдельно от иконки */}
              <Box
                sx={{
                  background: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 3,
                  p: 1,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: 140,
                  border: `2px solid ${horse.color}`,
                  position: 'relative',
                }}
              >
                {/* Имя менеджера */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    color: horse.color,
                    mb: 0.25,
                    textAlign: 'center',
                  }}
                >
                  {horse.name}
                </Typography>

                {/* Фактическая выручка */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'success.main',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    mb: 0.1,
                  }}
                >
                  {formatValue(horse.factRevenue.toString())}
                </Typography>

                {/* Прогноз */}
                <Typography
                  variant="caption"
                  sx={{
                    color: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'),
                    fontSize: '0.65rem',
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
    </Box>
  );
});
