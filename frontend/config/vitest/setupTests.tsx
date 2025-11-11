import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Моки для MUI компонентов, которые могут вызывать проблемы в тестах
vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({
    onChange,
    value,
    ...props
  }: {
    onChange?: (value: string) => void;
    value?: string;
    [key: string]: unknown;
  }) => <input data-testid="date-picker" value={value} onChange={(e) => onChange?.(e.target.value)} {...props} />,
}));

vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@mui/x-date-pickers/AdapterDateFns', () => ({
  AdapterDateFns: () => ({}),
}));

// Мок для useMediaQuery, который может вызывать проблемы
vi.mock('@mui/material/useMediaQuery', () => ({
  default: () => false,
}));
