import { HeadCell } from './types';

export const MEDAL_MAPPER: Record<number, string> = {
  0: '🥇',
  1: '🥈',
  2: '🥉',
};

export const HEAD_CELLS: readonly HeadCell[] = [
  {
    id: 'avatar',
    numeric: false,
    disablePadding: true,
    label: '',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: '',
  },
  {
    id: 'deals',
    numeric: true,
    disablePadding: false,
    label: 'Успешых сделок',
  },
  {
    id: 'budget',
    numeric: true,
    disablePadding: false,
    label: 'Бюджет',
  },
];

export const SORTABLE_COLUMNS = new Set(['deals', 'budget']);

export const DEFAULT_SKELETON_COUNT = 10;
