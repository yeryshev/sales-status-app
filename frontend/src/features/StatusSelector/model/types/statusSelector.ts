import { Status } from '@/entities/Status';

export interface StatusSelectorSchema {
  statusSelectItem?: Status;
  error?: string;
}
