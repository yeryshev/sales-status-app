import { memo } from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { green, red, orange } from '@mui/material/colors';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SyncIcon from '@mui/icons-material/Sync';

interface WebSocketStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts?: number;
  maxReconnectAttempts?: number;
  isOnline?: boolean;
  className?: string;
}

export const WebSocketStatus = memo((props: WebSocketStatusProps) => {
  const {
    isConnected,
    isConnecting,
    reconnectAttempts = 0,
    maxReconnectAttempts = 5,
    isOnline = true,
    className,
  } = props;

  const getStatusInfo = () => {
    if (isConnected) {
      return {
        label: 'Подключено',
        color: green[500],
        icon: <WifiIcon />,
        tooltip: 'WebSocket соединение активно. Данные обновляются в реальном времени.',
      };
    }

    if (isConnecting) {
      return {
        label: 'Подключение...',
        color: orange[500],
        icon: <SyncIcon className="animate-spin" />,
        tooltip: reconnectAttempts > 0 
          ? `Переподключение... Попытка ${reconnectAttempts}/${maxReconnectAttempts}`
          : 'Установка соединения...',
      };
    }

    // Определяем причину отключения
    let tooltip = 'Соединение потеряно. Данные могут быть неактуальными.';
    let label = 'Отключено';
    
    if (!isOnline) {
      tooltip = 'Нет подключения к интернету. Проверьте сетевое соединение.';
      label = 'Нет интернета';
    } else if (reconnectAttempts >= maxReconnectAttempts) {
      tooltip = 'Соединение потеряно. Превышено максимальное количество попыток переподключения.';
    }
    
    return {
      label,
      color: red[500],
      icon: <WifiOffIcon />,
      tooltip,
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Box className={className}>
      <Tooltip title={statusInfo.tooltip} arrow>
        <Chip
          icon={statusInfo.icon}
          label={statusInfo.label}
          size="small"
          sx={{
            backgroundColor: `${statusInfo.color}20`,
            color: statusInfo.color,
            border: `1px solid ${statusInfo.color}40`,
            '& .MuiChip-icon': {
              color: statusInfo.color,
            },
          }}
        />
      </Tooltip>
    </Box>
  );
}); 