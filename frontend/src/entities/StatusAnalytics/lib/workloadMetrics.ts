import { WorkloadCountersData } from '../model/types/statusAnalytics';

export const WORKLOAD_METRICS = [
  { key: 'leads', label: 'Первичные обращения', color: '#1976d2' },
  { key: 'overdueTasks', label: 'Просроченные задачи', color: '#d32f2f' },
  { key: 'openConversations', label: 'Открытые чаты', color: '#7b1fa2' },
  { key: 'assignedTickets', label: 'Назначенные тикеты', color: '#ed6c02' },
] as const;

export type WorkloadMetricKey = (typeof WORKLOAD_METRICS)[number]['key'];

export function formatWorkloadValue(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return String(value);
}

export function getWorkloadMetricValue(counters: WorkloadCountersData, key: WorkloadMetricKey): number | null {
  return counters[key];
}
