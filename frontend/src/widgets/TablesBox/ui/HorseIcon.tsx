import { memo } from 'react';
import { Box } from '@mui/material';
import { baseHorseIcons, specialHorseIcons } from '@/shared/assets/icons/horses';

interface HorseIconProps {
  color: string;
  size?: number;
  variant?: number;
  usePngIcons?: boolean; // Новый пропс для переключения между SVG и PNG
}

export const HorseIcon = memo((props: HorseIconProps) => {
  const { color, size = 40, variant = 0, usePngIcons = true } = props;

  // Если используются PNG иконки
  if (usePngIcons) {
    // Базовые иконки для стандартных позиций
    const baseIcons = [
      baseHorseIcons.first, // Первое место - всегда first.png
      baseHorseIcons.regular1,
      baseHorseIcons.regular2,
      baseHorseIcons.regular3,
      baseHorseIcons.regular4,
      baseHorseIcons.last, // Последнее место - всегда last.png
    ];

    // Специальные иконки по ID (динамически)
    const specialIcons = Object.values(specialHorseIcons);

    // Объединяем все иконки
    const allIcons = [...baseIcons, ...specialIcons];

    const selectedPngIcon = allIcons[variant % allIcons.length];

    return (
      <Box
        sx={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={selectedPngIcon}
          alt={`Horse variant ${variant + 1}`}
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
          }}
        />
      </Box>
    );
  }

  // Существующие SVG варианты
  const horseVariants = [
    // Вариант 1: Простая лошадь в профиль (на основе первого изображения)
    (color: string, size: number) => (
      <Box
        sx={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          {/* Тело лошади - более вытянутое */}
          <ellipse cx="45" cy="65" rx="28" ry="18" fill={color} stroke="#000" strokeWidth="2" />
          {/* Голова - более вытянутая морда */}
          <ellipse cx="80" cy="55" rx="18" ry="15" fill={color} stroke="#000" strokeWidth="2" />
          {/* Морда */}
          <ellipse cx="95" cy="58" rx="8" ry="6" fill={color} stroke="#000" strokeWidth="1" />
          {/* Уши - более длинные и заостренные */}
          <polygon points="88,45 92,35 88,55" fill={color} stroke="#000" strokeWidth="1" />
          <polygon points="90,45 94,35 90,55" fill={color} stroke="#000" strokeWidth="1" />
          {/* Грива - более пышная */}
          <path d="M65,50 Q70,30 75,50 Q80,30 85,50 Q90,30 95,50" fill="#8B4513" stroke="#000" strokeWidth="1" />
          {/* Хвост - более длинный и пышный */}
          <path d="M17,65 Q12,45 7,50 Q2,35 -3,40" fill="#8B4513" stroke="#000" strokeWidth="1" />
          {/* Ноги - более длинные и тонкие */}
          <rect x="35" y="80" width="4" height="20" fill={color} stroke="#000" strokeWidth="1" />
          <rect x="45" y="80" width="4" height="20" fill={color} stroke="#000" strokeWidth="1" />
          <rect x="55" y="80" width="4" height="20" fill={color} stroke="#000" strokeWidth="1" />
          <rect x="65" y="80" width="4" height="20" fill={color} stroke="#000" strokeWidth="1" />
          {/* Копыта */}
          <ellipse cx="37" cy="100" rx="3" ry="2" fill="#8B4513" stroke="#000" strokeWidth="1" />
          <ellipse cx="47" cy="100" rx="3" ry="2" fill="#8B4513" stroke="#000" strokeWidth="1" />
          <ellipse cx="57" cy="100" rx="3" ry="2" fill="#8B4513" stroke="#000" strokeWidth="1" />
          <ellipse cx="67" cy="100" rx="3" ry="2" fill="#8B4513" stroke="#000" strokeWidth="1" />
          {/* Глаз */}
          <circle cx="85" cy="52" r="3" fill="#000" />
          {/* Ноздри */}
          <ellipse cx="98" cy="58" rx="2" ry="1.5" fill="#000" />
        </svg>
      </Box>
    ),

    // Вариант 2: Лошадь с колесами (на основе второго изображения)
    (color: string, size: number) => (
      <Box
        sx={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          {/* Платформа */}
          <rect x="5" y="75" width="90" height="10" fill="#8B4513" stroke="#000" strokeWidth="1" />
          {/* Колеса */}
          <circle cx="15" cy="90" r="8" fill="#D2691E" stroke="#000" strokeWidth="1" />
          <circle cx="35" cy="90" r="8" fill="#D2691E" stroke="#000" strokeWidth="1" />
          <circle cx="55" cy="90" r="8" fill="#D2691E" stroke="#000" strokeWidth="1" />
          <circle cx="75" cy="90" r="8" fill="#D2691E" stroke="#000" strokeWidth="1" />
          <circle cx="85" cy="90" r="8" fill="#D2691E" stroke="#000" strokeWidth="1" />
          {/* Тело лошади - более реалистичное */}
          <ellipse cx="45" cy="55" rx="25" ry="18" fill={color} stroke="#000" strokeWidth="2" />
          {/* Голова */}
          <ellipse cx="75" cy="50" rx="15" ry="12" fill={color} stroke="#000" strokeWidth="2" />
          {/* Морда */}
          <ellipse cx="88" cy="53" rx="6" ry="4" fill={color} stroke="#000" strokeWidth="1" />
          {/* Уши */}
          <polygon points="85,42 88,35 85,52" fill={color} stroke="#000" strokeWidth="1" />
          {/* Грива */}
          <path d="M65,45 Q70,25 75,45 Q80,25 85,45" fill="#8B4513" stroke="#000" strokeWidth="1" />
          {/* Хвост */}
          <path d="M20,55 Q15,35 10,40" fill="#8B4513" stroke="#000" strokeWidth="1" />
          {/* Ноги */}
          <rect x="35" y="70" width="4" height="15" fill={color} stroke="#000" strokeWidth="1" />
          <rect x="45" y="70" width="4" height="15" fill={color} stroke="#000" strokeWidth="1" />
          <rect x="55" y="70" width="4" height="15" fill={color} stroke="#000" strokeWidth="1" />
          <rect x="65" y="70" width="4" height="15" fill={color} stroke="#000" strokeWidth="1" />
          {/* Глаз */}
          <circle cx="80" cy="48" r="2" fill="#000" />
          {/* Ноздри */}
          <ellipse cx="90" cy="54" rx="1.5" ry="1" fill="#000" />
        </svg>
      </Box>
    ),

    // Вариант 3: Лошадка-качалка (на основе третьего изображения)
    (color: string, size: number) => (
      <Box
        sx={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          {/* Основание-качалка */}
          <path d="M15,85 Q50,95 85,85" fill="#F4A460" stroke="#000" strokeWidth="2" />
          {/* Тело лошади - более реалистичное */}
          <ellipse cx="45" cy="60" rx="22" ry="15" fill={color} stroke="#000" strokeWidth="2" />
          {/* Голова */}
          <ellipse cx="70" cy="55" rx="14" ry="11" fill={color} stroke="#000" strokeWidth="2" />
          {/* Морда */}
          <ellipse cx="82" cy="58" rx="5" ry="3" fill={color} stroke="#000" strokeWidth="1" />
          {/* Уши */}
          <polygon points="78,48 82,40 78,58" fill={color} stroke="#000" strokeWidth="1" />
          {/* Грива */}
          <path d="M60,50 Q65,30 70,50 Q75,30 80,50" fill="#8B4513" stroke="#000" strokeWidth="1" />
          {/* Хвост */}
          <path d="M23,60 Q18,40 13,45" fill="#8B4513" stroke="#000" strokeWidth="1" />
          {/* Седло */}
          <ellipse cx="45" cy="55" rx="15" ry="8" fill="#696969" stroke="#000" strokeWidth="1" />
          {/* Ноги */}
          <rect x="35" y="75" width="4" height="15" fill={color} stroke="#000" strokeWidth="1" />
          <rect x="45" y="75" width="4" height="15" fill={color} stroke="#000" strokeWidth="1" />
          <rect x="55" y="75" width="4" height="15" fill={color} stroke="#000" strokeWidth="1" />
          <rect x="65" y="75" width="4" height="15" fill={color} stroke="#000" strokeWidth="1" />
          {/* Глаз */}
          <circle cx="75" cy="52" r="2" fill="#000" />
          {/* Ноздри */}
          <ellipse cx="85" cy="59" rx="1.5" ry="1" fill="#000" />
        </svg>
      </Box>
    ),

    // Вариант 4: Динамичная лошадь в движении (на основе четвертого изображения)
    (color: string, size: number) => (
      <Box
        sx={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          {/* Тело лошади - более вытянутое */}
          <ellipse cx="40" cy="60" rx="25" ry="15" fill={color} stroke="#000" strokeWidth="2" />
          {/* Голова */}
          <ellipse cx="70" cy="55" rx="16" ry="12" fill={color} stroke="#000" strokeWidth="2" />
          {/* Морда */}
          <ellipse cx="85" cy="58" rx="7" ry="5" fill={color} stroke="#000" strokeWidth="1" />
          {/* Уши */}
          <polygon points="78,48 82,40 78,58" fill={color} stroke="#000" strokeWidth="1" />
          {/* Грива (пышная) */}
          <path d="M60,50 Q65,25 70,50 Q75,25 80,50 Q85,25 90,50" fill="#8B4513" stroke="#000" strokeWidth="1" />
          {/* Хвост (пышный) */}
          <path d="M15,60 Q10,35 5,40 Q0,20 -5,25" fill="#8B4513" stroke="#000" strokeWidth="1" />
          {/* Ноги в движении - более реалистичные */}
          <path d="M30,75 L30,95 M30,95 L25,100" stroke={color} strokeWidth="4" fill="none" />
          <path d="M40,75 L40,95 M40,95 L45,100" stroke={color} strokeWidth="4" fill="none" />
          <path d="M50,75 L50,95 M50,95 L55,100" stroke={color} strokeWidth="4" fill="none" />
          <path d="M60,75 L60,95 M60,95 L65,100" stroke={color} strokeWidth="4" fill="none" />
          {/* Копыта */}
          <ellipse cx="25" cy="100" rx="3" ry="2" fill="#8B4513" stroke="#000" strokeWidth="1" />
          <ellipse cx="45" cy="100" rx="3" ry="2" fill="#8B4513" stroke="#000" strokeWidth="1" />
          <ellipse cx="55" cy="100" rx="3" ry="2" fill="#8B4513" stroke="#000" strokeWidth="1" />
          <ellipse cx="65" cy="100" rx="3" ry="2" fill="#8B4513" stroke="#000" strokeWidth="1" />
          {/* Глаз */}
          <circle cx="80" cy="52" r="2" fill="#000" />
          {/* Ноздри */}
          <ellipse cx="90" cy="59" rx="1.5" ry="1" fill="#000" />
          {/* Блик на теле */}
          <ellipse cx="35" cy="55" rx="10" ry="6" fill="#FFE4B5" opacity="0.7" />
        </svg>
      </Box>
    ),

    // Вариант 5: Стильная лошадь с градиентом (на основе пятого изображения)
    (color: string, size: number) => (
      <Box
        sx={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={`${color}CC`} />
            </linearGradient>
          </defs>
          {/* Тело лошади с градиентом - более реалистичное */}
          <ellipse cx="45" cy="65" rx="28" ry="18" fill={`url(#gradient-${color})`} stroke="#000" strokeWidth="2" />
          {/* Голова */}
          <ellipse cx="75" cy="60" rx="16" ry="13" fill={`url(#gradient-${color})`} stroke="#000" strokeWidth="2" />
          {/* Морда */}
          <ellipse cx="90" cy="63" rx="7" ry="5" fill={`url(#gradient-${color})`} stroke="#000" strokeWidth="1" />
          {/* Уши */}
          <polygon points="88,52 92,45 88,62" fill={`url(#gradient-${color})`} stroke="#000" strokeWidth="1" />
          {/* Грива (волнистая) */}
          <path d="M65,55 Q70,35 75,55 Q80,35 85,55 Q90,35 95,55" fill="#696969" stroke="#000" strokeWidth="1" />
          {/* Хвост */}
          <path d="M17,65 Q12,45 7,50 Q2,35 -3,40" fill="#696969" stroke="#000" strokeWidth="1" />
          {/* Ноги */}
          <rect x="35" y="80" width="5" height="20" fill={`url(#gradient-${color})`} stroke="#000" strokeWidth="1" />
          <rect x="45" y="80" width="5" height="20" fill={`url(#gradient-${color})`} stroke="#000" strokeWidth="1" />
          <rect x="55" y="80" width="5" height="20" fill={`url(#gradient-${color})`} stroke="#000" strokeWidth="1" />
          <rect x="65" y="80" width="5" height="20" fill={`url(#gradient-${color})`} stroke="#000" strokeWidth="1" />
          {/* Копыта */}
          <ellipse cx="37" cy="100" rx="4" ry="3" fill="#696969" stroke="#000" strokeWidth="1" />
          <ellipse cx="47" cy="100" rx="4" ry="3" fill="#696969" stroke="#000" strokeWidth="1" />
          <ellipse cx="57" cy="100" rx="4" ry="3" fill="#696969" stroke="#000" strokeWidth="1" />
          <ellipse cx="67" cy="100" rx="4" ry="3" fill="#696969" stroke="#000" strokeWidth="1" />
          {/* Глаз */}
          <circle cx="85" cy="57" r="2" fill="#000" />
          {/* Ноздри */}
          <ellipse cx="93" cy="64" rx="1.5" ry="1" fill="#000" />
        </svg>
      </Box>
    ),
  ];

  return horseVariants[variant % horseVariants.length](color, size);
});
