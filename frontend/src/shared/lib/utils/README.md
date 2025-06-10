# Logger Utility

Утилита для логирования, которая автоматически отключает логи в production среде.

## Использование

```typescript
import { logger } from '@/shared/lib/utils/logger';

// Обычные логи (только в development)
logger.log('Информационное сообщение');
logger.info('Дополнительная информация');
logger.debug('Отладочная информация');
logger.warn('Предупреждение');

// Ошибки (выводятся всегда, включая production)
logger.error('Критическая ошибка');
```

## Поведение

- **Development режим** (`import.meta.env.MODE === 'development'`):
  - Все методы работают как обычные `console.*`
  - Логи выводятся в консоль браузера

- **Production режим**:
  - `logger.log()`, `logger.info()`, `logger.debug()`, `logger.warn()` - не выводят ничего
  - `logger.error()` - выводит ошибки (критичные для отладки)

## Преимущества

1. **Чистый production**: Никаких лишних логов в продакшене
2. **Безопасность**: Не раскрываем внутреннюю логику приложения
3. **Производительность**: Меньше операций в production
4. **Единообразие**: Все логи в проекте используют одну систему

## Миграция с console.*

Заменить все `console.log` → `logger.log`, `console.warn` → `logger.warn` и т.д.

**Было:**
```typescript
console.log('WebSocket connected');
console.error('Connection failed');
```

**Стало:**
```typescript
import { logger } from '@/shared/lib/utils/logger';

logger.log('WebSocket connected');
logger.error('Connection failed');
``` 